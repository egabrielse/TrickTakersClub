package service

import (
	"context"
	"main/domain/entity"
	"main/domain/game"
	"main/domain/object"
	"main/domain/repository"
	"main/domain/service/message"
	"main/utils"
	"time"

	"github.com/ably/ably-go/ably"
	"github.com/sirupsen/logrus"
)

// TableService represents the service for controlling the table
type TableService struct {
	Table        *entity.TableEntity    `json:"table"`
	GameSettings *game.GameSettings     `json:"gameSettings"`
	LastUpdate   time.Time              `json:"lastUpdate"`
	Users        map[string]*UserClient `json:"users"`
	AblyClient   *ably.Realtime         `json:"-"`
	Channel      *ably.RealtimeChannel  `json:"-"`
	Ctx          context.Context        `json:"-"`
}

func NewTableService(tableId string, hostId string) (*TableService, error) {
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
		return &TableService{
			Table: &entity.TableEntity{
				ID:     tableId,
				HostID: hostId,
			},
			GameSettings: game.NewGameSettings(),
			LastUpdate:   time.Now(),
			Users:        make(map[string]*UserClient),
			AblyClient:   ablyClient,
			Channel:      ablyClient.Channels.Get(tableId),
			Ctx:          ctx,
		}, nil
	}
}

func (t *TableService) GetState() *object.TableState {
	return &object.TableState{
		TableID:      t.Table.ID,
		HostID:       t.Table.HostID,
		GameSettings: t.GameSettings,
	}
}

// HandleMessage handles messages received from the public channel
func (t *TableService) HandlePublicMessage(msg *ably.Message) {
	// Reset the ticker if any activity is detected
	t.LastUpdate = time.Now()
	logrus.Infof("Received message: %s", msg.Data)
}

// HandlePrivateMessage handles messages sent to the table service via the user's private channel
func (t *TableService) HandlePrivateMessage(msg *ably.Message) {
	// Reset the ticker if any activity is detected
	t.LastUpdate = time.Now()
	logrus.Infof("Received message: %s", msg.Data)
	if msg.Name == message.MessageType.UpdateSettings && msg.ClientID == t.Table.HostID {
		logrus.Info("Received game settings update")
		payload := msg.Data.(game.GameSettings)
		t.GameSettings = &payload
		t.Channel.Publish(t.Ctx, message.MessageType.UpdateSettings, payload)
	}
}

func (t *TableService) RegisterPresence(presence *ably.PresenceMessage) {
	logrus.Infof("User %s entered the table", presence.ClientID)
	if user, ok := t.Users[presence.ClientID]; ok {
		user.Enter(t.Ctx, presence.ConnectionID, t.HandlePrivateMessage)
	} else {
		user := NewUserClient(
			presence.ClientID,
			presence.ConnectionID,
			t.AblyClient.Channels.Get(t.Table.ID+":"+presence.ClientID),
		)
		t.Users[presence.ClientID] = user
		user.Enter(t.Ctx, presence.ConnectionID, t.HandlePrivateMessage)
	}
	// Send the current state of the table/game to the newly registered user
	t.Users[presence.ClientID].Publish(t.Ctx, message.MessageType.State, t.GetState())
}

func (t *TableService) UnregisterPresence(presence *ably.PresenceMessage) {
	logrus.Infof("User %s left the table", presence.ClientID)
	if _, ok := t.Users[presence.ClientID]; ok {
		t.Users[presence.ClientID].Leave(t.Ctx, presence.ConnectionID)
	}
}

func (t *TableService) StartService() {
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
			t.Channel.SubscribeAll(t.Ctx, t.HandlePublicMessage)

			// Check for clients already present at the table
			if set, err := t.Channel.Presence.Get(t.Ctx); utils.LogOnError(err) {
				logrus.Error("Failed to get presence set")
			} else {
				for _, presence := range set {
					t.RegisterPresence(presence)
				}
			}

			// Subscribe to presence events on the public channel
			t.Channel.Presence.Subscribe(t.Ctx, ably.PresenceActionEnter, func(presence *ably.PresenceMessage) {
				t.RegisterPresence(presence)
			})

			t.Channel.Presence.Subscribe(t.Ctx, ably.PresenceActionLeave, func(presence *ably.PresenceMessage) {
				t.UnregisterPresence(presence)
			})
		})

		t.AblyClient.Connect()

		for {
			select {
			case <-ticker.C:
				if time.Since(t.LastUpdate) >= TimeoutDuration {
					// Stop the service if no activity is detected for a certain duration
					logrus.Infof("Service for table %s timed out", t.Table.ID)
					// Inform any clients that the service has timed out
					t.Channel.Publish(t.Ctx, message.MessageType.Timeout, nil)
					return
				}
			case <-t.Ctx.Done():
				logrus.Infof("Service for table %s was ended", t.Table.ID)
				return
			}
		}
	}()
}
