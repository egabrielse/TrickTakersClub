package service

import (
	"context"
	"main/domain/entity"
	"main/domain/game"
	"main/domain/repository"
	"main/domain/service/msg"
	"main/utils"
	"time"

	"github.com/ably/ably-go/ably"
	"github.com/sirupsen/logrus"
)

// TableWorker represents the service for controlling the table
type TableWorker struct {
	Table         *entity.TableEntity
	Game          *game.Game
	SeatedPlayers []string
	GameSettings  *game.GameSettings
	LastUpdate    time.Time
	Users         map[string]*UserClient
	AblyClient    *ably.Realtime
	Channel       *ably.RealtimeChannel
	Ctx           context.Context
}

func NewTableWorker(table *entity.TableEntity) (*TableWorker, error) {
	ctx := context.Background()
	key := utils.GetEnvironmentVariable("ABLY_API_KEY")

	options := []ably.ClientOption{
		ably.WithKey(key),
		ably.WithAutoConnect(false),
		ably.WithEchoMessages(false),
	}
	if ablyClient, err := ably.NewRealtime(options...); utils.LogOnError(err) {
		return nil, err
	} else {
		return &TableWorker{
			Table:         table,
			LastUpdate:    time.Now(),
			GameSettings:  game.NewGameSettings(),
			SeatedPlayers: []string{table.HostID},
			Users:         make(map[string]*UserClient),
			AblyClient:    ablyClient,
			Channel:       ablyClient.Channels.Get(table.ID),
			Ctx:           ctx,
		}, nil
	}
}

// Broadcast sends a message to all clients connected to the table via the public channel
func (t *TableWorker) BroadcastMessage(name string, data interface{}) {
	t.Channel.Publish(t.Ctx, name, data)
}

// DirectMessage sends a message to a specific client via their private channel
func (t *TableWorker) DirectMessage(clientID string, name string, data interface{}) {
	if user, ok := t.Users[clientID]; ok {
		user.Publish(t.Ctx, name, data)
	} else {
		logrus.Warnf("User %s not found", clientID)
	}
}

// HandleMessage handles messages received from the public channel
func (t *TableWorker) HandleMessages(message *ably.Message) {
	// Reset the ticker if any activity is detected
	t.LastUpdate = time.Now()
	logrus.Infof("Received public message: %s", message.Data)
}

// HandlePrivateMessage handles messages sent to the table service via the user's private channel
func (t *TableWorker) HandleCommands(message *ably.Message) {
	// Reset the ticker if any activity is detected
	t.LastUpdate = time.Now()
	logrus.Infof("Received private message: %s", message.Data)
	switch message.Name {
	case msg.CommandType.UpdateAutoDeal:
		HandleUpdateAutoDeal(t, message.ClientID, message.Data)
	case msg.CommandType.UpdateCallingMethod:
		HandleUpdateCallingMethod(t, message.ClientID, message.Data)
	case msg.CommandType.UpdateDoubleOnTheBump:
		HandleUpdateDoubleOnTheBump(t, message.ClientID, message.Data)
	case msg.CommandType.UpdateNoPickResolution:
		HandleUpdateNoPickResolution(t, message.ClientID, message.Data)

	case msg.CommandType.SitDown:
		HandleSitDownCommand(t, message.ClientID, message.Data)
	case msg.CommandType.StandUp:
		HandleStandUpCommand(t, message.ClientID, message.Data)
	case msg.CommandType.StartGame:
		HandleStartGameCommand(t, message.ClientID, message.Data)
	case msg.CommandType.EndGame:
		HandleEndGameCommand(t, message.ClientID, message.Data)
	case msg.CommandType.Pick:
		HandlePickCommand(t, message.ClientID, message.Data)
	case msg.CommandType.Pass:
		HandlePassCommand(t, message.ClientID, message.Data)
	case msg.CommandType.Bury:
		HandleBuryCommand(t, message.ClientID, message.Data)
	case msg.CommandType.Call:
		HandleCallCommand(t, message.ClientID, message.Data)
	case msg.CommandType.GoAlone:
		HandleGoAloneCommand(t, message.ClientID, message.Data)
	case msg.CommandType.PlayCard:
		HandlePlayCardCommand(t, message.ClientID, message.Data)
	default:
		logrus.Warnf("Unknown message type: %s", message.Name)
	}
}

// RegisterClient registers a new client to the table service
func (t *TableWorker) RegisterClient(clientID string, connectionID string) {
	logrus.Infof("User %s entered the table", clientID)
	if user, ok := t.Users[clientID]; ok {
		user.Enter(t.Ctx, connectionID, t.HandleCommands)
	} else {
		user := NewUserClient(clientID, t.Table.ID, t.AblyClient)
		t.Users[clientID] = user
		user.Enter(t.Ctx, connectionID, t.HandleCommands)
	}
	// Send the current state of the table/game to the newly registered user
	t.DirectMessage(msg.InitializeMessage(t.Table.ID, t.Table.HostID, clientID, t.SeatedPlayers, t.GameSettings, t.Game))
}

// UnregisterClient unregisters a client from the table service
func (t *TableWorker) UnregisterClient(clientID string, connectionID string) {
	logrus.Infof("User %s left the table", clientID)
	if _, ok := t.Users[clientID]; ok {
		t.Users[clientID].Leave(t.Ctx, connectionID)
		// TODO: user stands up if seated (need to add logic for quitting during a game)
	}
}

// StartService starts a goroutine for the table service and begins listening for messages
func (t *TableWorker) StartService() {
	serverWorkerTimeout := utils.GetEnvironmentVariable("SERVER_WORKER_TIMEOUT")
	// Convert the timeout duration to integer
	timeoutDuration, err := time.ParseDuration(serverWorkerTimeout)
	if err != nil {
		timeoutDuration = DefaultTimeoutDuration
	}

	go func() {
		logrus.Infof("Starting service for table %s", t.Table.ID)
		ticker := time.NewTicker(TickerDuration)
		defer func() {
			logrus.Infof("Service for table %s stopped", t.Table.ID)
			ticker.Stop()
			t.AblyClient.Close()
			tableRepo := repository.GetTableRepo()
			err := tableRepo.Delete(t.Ctx, t.Table.ID)
			utils.LogOnError(err)
		}()

		t.AblyClient.Connection.OnAll(func(change ably.ConnectionStateChange) {
			logrus.Infof("Connection state changed: %s", change.Current)
		})

		t.AblyClient.Connection.Once(ably.ConnectionEventConnected, func(change ably.ConnectionStateChange) {
			// Subscribe to the public channel messages
			t.Channel.SubscribeAll(t.Ctx, t.HandleMessages)

			// Check for clients already present at the table
			if set, err := t.Channel.Presence.Get(t.Ctx); utils.LogOnError(err) {
				logrus.Error("Failed to get presence set")
			} else {
				for _, presence := range set {
					t.RegisterClient(presence.ClientID, presence.ConnectionID)
				}
			}

			// Subscribe to presence events on the public channel
			t.Channel.Presence.Subscribe(t.Ctx, ably.PresenceActionEnter, func(presence *ably.PresenceMessage) {
				t.RegisterClient(presence.ClientID, presence.ConnectionID)
			})

			t.Channel.Presence.Subscribe(t.Ctx, ably.PresenceActionLeave, func(presence *ably.PresenceMessage) {
				t.UnregisterClient(presence.ClientID, presence.ConnectionID)
			})
		})

		// Connect to the Ably service
		t.AblyClient.Connect()

		for {
			select {
			case <-ticker.C:
				if time.Since(t.LastUpdate) >= timeoutDuration {
					// Stop the service if no activity is detected for a certain duration
					logrus.Infof("Service for table %s timed out", t.Table.ID)
					// Inform any clients that the service has timed out
					t.BroadcastMessage(msg.TimeoutMessage())
					return
				}
			case <-t.Ctx.Done():
				logrus.Infof("Service for table %s was ended", t.Table.ID)
				return
			}
		}
	}()
}
