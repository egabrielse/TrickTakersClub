package service

import (
	"context"
	"main/domain/entity"
	"main/domain/game"
	"main/domain/repository"
	"main/utils"
	"time"

	"github.com/ably/ably-go/ably"
	"github.com/sirupsen/logrus"
)

// TableService represents the service for controlling the table
type TableService struct {
	Table      *entity.TableEntity    `json:"table"`
	Game       *game.Sheepshead       `json:"game"`
	LastUpdate time.Time              `json:"lastUpdate"`
	Users      map[string]*UserClient `json:"users"`
	AblyClient *ably.Realtime         `json:"-"`
	Channel    *ably.RealtimeChannel  `json:"-"`
	Ctx        context.Context        `json:"-"`
}

func NewTableService(table *entity.TableEntity) (*TableService, error) {
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
			Table:      table,
			LastUpdate: time.Now(),
			Users:      make(map[string]*UserClient),
			AblyClient: ablyClient,
			Channel:    ablyClient.Channels.Get(table.ID),
			Ctx:        ctx,
		}, nil
	}
}

// GetState returns the current state of the table
func (t *TableService) GetRefreshPayload(clientID string) *RefreshPayload {
	payload := &RefreshPayload{
		TableID: t.Table.ID,
		HostID:  t.Table.HostID,
	}
	// A game, send the state of the game
	if t.Game != nil {
		payload.GameState = &GameState{
			DealerID:    t.Game.PlayerOrder[t.Game.DealerIndex],
			Scoreboard:  t.Game.Scoreboard,
			PlayerOrder: t.Game.PlayerOrder,
			HandsPlayed: t.Game.HandsPlayed,
			Settings:    t.Game.Settings,
		}
		// Hand is in progress, send the state of the current hand
		if t.Game.HandInProgress() {
			payload.HandState = &HandState{
				CalledCard: t.Game.Hand.CalledCard,
				BlindSize:  len(t.Game.Hand.Blind),
				Phase:      t.Game.Hand.Phase,
				PickerID:   t.Game.Hand.PickerID,
				PartnerID:  t.Game.Hand.PartnerID,
				Tricks:     t.Game.Hand.Tricks,
				UpNextID:   t.Game.Hand.WhoIsNext(),
			}
			// Client is a player in the current game, send their hand and bury
			if player, ok := t.Game.Hand.Players[clientID]; ok {
				payload.PlayerHandState = &PlayerHandState{
					Hand: player.Hand,
					Bury: player.Bury,
				}
			}
		}
	}
	return payload
}

// Broadcast sends a message to all clients connected to the table via the public channel
func (t *TableService) Broadcast(name string, data interface{}) {
	t.Channel.Publish(t.Ctx, name, data)
}

// DirectMessage sends a message to a specific client via their private channel
func (t *TableService) DirectMessage(clientID string, name string, data interface{}) {
	if user, ok := t.Users[clientID]; ok {
		user.Publish(t.Ctx, name, data)
	} else {
		logrus.Warnf("User %s not found", clientID)
	}
}

// HandleMessage handles messages received from the public channel
func (t *TableService) HandleMessages(msg *ably.Message) {
	// Reset the ticker if any activity is detected
	t.LastUpdate = time.Now()
	logrus.Infof("Received public message: %s", msg.Data)
}

// HandlePrivateMessage handles messages sent to the table service via the user's private channel
func (t *TableService) HandleCommands(msg *ably.Message) {
	// Reset the ticker if any activity is detected
	t.LastUpdate = time.Now()
	logrus.Infof("Received private message: %s", msg.Data)
	switch msg.Name {
	case CommandType.CreateGame:
		HandleCreateGameCommand(t, msg.ClientID, msg.Data)
	case CommandType.SitDown:
		HandleSitDownCommand(t, msg.ClientID, msg.Data)
	case CommandType.StandUp:
		HandleStandUpCommand(t, msg.ClientID, msg.Data)
	case CommandType.EndGameCommand:
		HandleEndGameCommand(t, msg.ClientID, msg.Data)
	default:
		logrus.Warnf("Unknown message type: %s", msg.Name)
	}
}

// RegisterClient registers a new client to the table service
func (t *TableService) RegisterClient(clientID string, connectionID string) {
	logrus.Infof("User %s entered the table", clientID)
	if user, ok := t.Users[clientID]; ok {
		user.Enter(t.Ctx, connectionID, t.HandleCommands)
	} else {
		user := NewUserClient(clientID, t.Table.ID, t.AblyClient)
		t.Users[clientID] = user
		user.Enter(t.Ctx, connectionID, t.HandleCommands)
	}
	// Send the current state of the table/game to the newly registered user
	t.DirectMessage(clientID, MessageType.Refresh, t.GetRefreshPayload(clientID))
}

// UnregisterClient unregisters a client from the table service
func (t *TableService) UnregisterClient(clientID string, connectionID string) {
	logrus.Infof("User %s left the table", clientID)
	if _, ok := t.Users[clientID]; ok {
		t.Users[clientID].Leave(t.Ctx, connectionID)
		// TODO: user stands up if seated (need to add logic for quitting during a game)
	}
}

// StartService starts a goroutine for the table service and begins listening for messages
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

		t.AblyClient.Connect()

		for {
			select {
			case <-ticker.C:
				if time.Since(t.LastUpdate) >= TimeoutDuration {
					// Stop the service if no activity is detected for a certain duration
					logrus.Infof("Service for table %s timed out", t.Table.ID)
					// Inform any clients that the service has timed out
					t.Broadcast(MessageType.Timeout, nil)
					return
				}
			case <-t.Ctx.Done():
				logrus.Infof("Service for table %s was ended", t.Table.ID)
				return
			}
		}
	}()
}
