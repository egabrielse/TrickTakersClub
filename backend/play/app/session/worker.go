package session

import (
	"common/clients"
	"common/env"
	"context"
	"encoding/json"
	"play/app/msg"
	"storage/entity"
	"storage/repository"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

type SessionWorker struct {
	session *entity.Session // Data for the session worker
	ctx     context.Context // Context for the session worker
	rdb     *redis.Client   // Redis client to interact with the Redis database
}

func NewSessionWorker(session *entity.Session) *SessionWorker {
	return &SessionWorker{
		session: session,
		ctx:     context.Background(),
		rdb:     clients.GetRedisClient(),
	}
}

func (sw *SessionWorker) sendMessage(receiverID string, message *msg.Message) int64 {
	// Set the sender ID and receiver ID for the message
	message.SetSenderID(msg.SessionWorkerID)
	message.SetReceiverID(receiverID)
	if bytes, err := json.Marshal(message); err != nil {
		logrus.Errorf("Session (%s): %v", sw.session.ID, err)
		return 0
	} else if result, err := sw.rdb.Publish(context.Background(), sw.session.ID, bytes).Result(); err != nil {
		logrus.Errorf("Session (%s): %v", sw.session.ID, err)
		return 0
	} else {
		logrus.Infof("Session (%s): message of type %s sent to %s, received by %d clients", sw.session.ID, message.MessageType, receiverID, result)
		return result
	}
}

func (sw *SessionWorker) broadcastMessage(message *msg.Message) int64 {
	return sw.sendMessage(msg.BroadcastRecipient, message)
}

func (sw *SessionWorker) StartWorker() {
	go func() {
		logrus.Infof("Session (%s): starting up...", sw.session.ID)
		// Get necessary repositories
		sessionRepo := repository.GetSessionRepo()
		gameRepo := repository.GetGameRepo()

		// Get environment variables
		workerTimeout := env.GetEnvVarAsDuration("SESSION_WORKER_TIMEOUT", defaultTimeout)
		gameExpiration := env.GetEnvVarAsDuration("GAME_EXPIRATION_DURATION", defaultGameExpiration)
		sessionExpiration := env.GetEnvVarAsDuration("SESSION_EXPIRATION_DURATION", defaultSessionExpiration)
		presenceExpiration := env.GetEnvVarAsDuration("PRESENCE_EXPIRATION_DURATION", defaultPresenceExpiration)

		// Create record in redis so the session is discoverable
		sessionRepo.Set(sw.ctx, sw.session, sessionExpiration)

		// Subscribe to the Redis channel for this session
		channel := sw.rdb.Subscribe(sw.ctx, sw.session.ID)

		// Set up a ticker to periodically check the session status
		ticker := time.NewTicker(tickerDuration)

		defer func() {
			logrus.Infof("Session (%s): stopping", sw.session.ID)
			// Stop the ticker
			ticker.Stop()
			// Unsubscribe from the Redis channel
			channel.Unsubscribe(sw.ctx, sw.session.ID)
			// If there is an active game, save it to redis
			if sw.session.GameInProgress() {
				gameRepo.Set(sw.ctx, sw.session.Game, gameExpiration)
			}
			// Delete the session from the repository
			sessionRepo.Delete(sw.ctx, sw.session.ID)
		}()

		for {
			select {
			case redisMessage := <-channel.Channel():
				var message *msg.Message
				if err := json.Unmarshal([]byte(redisMessage.Payload), &message); err != nil {
					logrus.Errorf("Session (%s): %v", sw.session.ID, err)
					// Ignore messages that cannot be unmarshalled, assume error is not on the worker side
					continue
				} else if message.SenderID == msg.SessionWorkerID {
					continue // Ignore messages sent by the worker itself
				} else if !message.IsRecipient(msg.SessionWorkerID) {
					continue // Ignore messages not meant for the session worker
				} else {
					switch message.MessageType {
					case msg.MessageTypeEnter:
						EnterHandler(sw, message)
					case msg.MessageTypeLeave:
						LeaveHandler(sw, message)
					case msg.MessageTypeChat:
						// Do nothing - all subscribed clients will receive the chat message
					case msg.MessageTypePong:
						PongHandler(sw, message)
						continue
					default:
						logrus.Warnf("Session (%s): Unknown message type: %s", sw.session.ID, message.MessageType)
						continue
					}
					// Refresh last updated timestamp for the session
					// Note: Messages that should not refresh this timestamp should "continue" before this point
					sw.session.LastUpdated = time.Now()
				}

			case <-ticker.C:
				if time.Since(sw.session.LastUpdated) >= workerTimeout {
					// Stop the service if no activity is detected for a certain duration
					logrus.Infof("Session (%s): timed out", sw.session.ID)
					sw.broadcastMessage(msg.NewTimeoutMessage())
					return
				} else {
					logrus.Infof("Session (%s): still alive", sw.session.ID)
				}
				// Ping connected client workers to keep presence up to date
				sw.broadcastMessage(msg.NewPingMessage())
				// Cleanup stale presence
				removed := sw.session.CleanupStalePresence(presenceExpiration)
				if len(removed) > 0 {
					// Notify clients of any removed players
					for _, playerID := range removed {
						logrus.Infof("Session (%s): player %s has been removed due to inactivity", sw.session.ID, playerID)
						sw.broadcastMessage(msg.NewLeftMessage(playerID))
					}
				}

				// Update the session in the redis if no game is started
				if !sw.session.GameInProgress() {
					err := sessionRepo.Set(sw.ctx, sw.session, time.Second*15)
					if err != nil {
						// If we fail to update the session, we should stop the worker as it is undiscoverable
						logrus.Errorf("Session (%s): %v", sw.session.ID, err)
						return
					}
				}
			case <-sw.ctx.Done():
				logrus.Infof("Session (%s): context done", sw.session.ID)
				return
			}
		}
	}()
}
