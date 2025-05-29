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
	session   *entity.Session // Data for the session worker
	ctx       context.Context // Context for the session worker
	rdb       *redis.Client   // Redis client to interact with the Redis database
	pingCount int64           // Count of clients who received the last ping
}

func NewSessionWorker(session *entity.Session) *SessionWorker {
	return &SessionWorker{
		session:   session,
		ctx:       context.Background(),
		rdb:       clients.GetRedisClient(),
		pingCount: 0,
	}
}

func (sw *SessionWorker) sendMessage(message *msg.Message) int64 {
	// Marshal the message into bytes
	if bytes, err := message.MarshalBinary(); err != nil {
		logrus.Errorf("SessionWorker: error marshalling message: %v", err)
		return 0
	} else if result, err := sw.rdb.Publish(context.Background(), sw.session.ID, bytes).Result(); err != nil {
		logrus.Errorf("SessionWorker: error sending message on channel %s: %v", sw.session.ID, err)
		return 0
	} else {
		return result
	}
}

func (sw *SessionWorker) StartWorker() {
	go func() {
		logrus.Infof("Starting service for table %s", sw.session.ID)
		// Get necessary repositories
		sessionRepo := repository.GetSessionRepo()
		gameRepo := repository.GetGameRepo()

		// Get environment variables
		workerTimeout := env.GetEnvVarAsDuration("SESSION_WORKER_TIMEOUT", DefaultTimeout)
		gameExpiration := env.GetEnvVarAsDuration("GAME_EXPIRATION_DURATION", DefaultGameExpiration)
		sessionExpiration := env.GetEnvVarAsDuration("SESSION_EXPIRATION_DURATION", DefaultSessionExpiration)
		presenceExpiration := env.GetEnvVarAsDuration("PRESENCE_EXPIRATION_DURATION", DefaultPresenceExpiration)

		// Create record in redis so the session is discoverable
		sessionRepo.Set(sw.ctx, sw.session, sessionExpiration)

		// Subscribe to the Redis channel for this session
		channel := sw.rdb.Subscribe(sw.ctx, sw.session.ID)

		// Set up a ticker to periodically check the session status
		ticker := time.NewTicker(TickerDuration)

		defer func() {
			logrus.Infof("Cleanup for session worker %s", sw.session.ID)
			ticker.Stop()
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
					logrus.Errorf("Connection: error unmarshalling redis message payload: %v", err)
					continue
				} else if message.ReceiverID != msg.BroadcastRecipient && message.ReceiverID != msg.SessionWorkerID {
					continue // Ignore messages not meant for this worker
				} else if message.MessageType == msg.MessageType.Pong {
					// Handle pong messages here to avoid setting the last updated time
					// Simply being connected does not count as activity
					PongHandler(sw, message)
				} else {
					// Update the last updated time for the session
					sw.session.LastUpdated = time.Now()
					switch message.MessageType {
					case msg.MessageType.Enter:
						EnterHandler(sw, message)
					case msg.MessageType.Leave:
						LeaveHandler(sw, message)
					case msg.MessageType.Chat:
						// Do nothing
					default:
						logrus.Warnf("Unknown message type: %s", message.MessageType)
					}
				}

			case <-ticker.C:
				if time.Since(sw.session.LastUpdated) >= workerTimeout {
					// Stop the service if no activity is detected for a certain duration
					logrus.Infof("Session worker %s timed out", sw.session.ID)
					sw.sendMessage(msg.NewTimeoutMessage())
					return
				}
				// Ping connected clients to keep the session alive
				sw.sendMessage(msg.NewPingMessage())
				// Cleanup stale presence
				sw.session.CleanupStalePresence(presenceExpiration)
				// Send the current presence to all clients
				sw.sendMessage(msg.NewPresenceMessage(sw.session.ListPresence()))

				// Update the session in the redis if no game is started
				if !sw.session.GameInProgress() {
					err := sessionRepo.Set(sw.ctx, sw.session, time.Second*15)
					if err != nil {
						// If we fail to update the session, we should stop the worker as it is undiscoverable
						logrus.Errorf("Failed to update session %s: %v", sw.session.ID, err)
						return
					}
				}
			case <-sw.ctx.Done():
				logrus.Infof("Context for session worker %s done", sw.session.ID)
				return
			}
		}
	}()
}
