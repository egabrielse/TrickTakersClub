package service

import (
	"context"
	"main/domain/repository"
	"main/utils"
	"time"

	"github.com/ably/ably-go/ably"
	"github.com/sirupsen/logrus"
)

// TimeoutDuration is the duration after which the service will be stopped if no activity is detected
const TimeoutDuration = time.Minute * 10
const TimeoutEvent = "timeout"

type UserClient struct {
	ID      string                `json:"id"`
	Present bool                  `json:"present"`
	Channel *ably.RealtimeChannel `json:"-"`
}

// TableService represents the service for controlling the table
type TableService struct {
	ID         string                 `json:"id"`
	HostID     string                 `json:"hostId"`
	LastUpdate time.Time              `json:"lastUpdate"`
	Users      map[string]*UserClient `json:"users"`
	AblyClient *ably.Realtime         `json:"-"`
	Channel    *ably.RealtimeChannel  `json:"-"`
	Ctx        context.Context        `json:"-"`
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
			ID:         tableId,
			HostID:     hostId,
			LastUpdate: time.Now(),
			Users:      make(map[string]*UserClient),
			AblyClient: ablyClient,
			Channel:    ablyClient.Channels.Get(tableId),
			Ctx:        ctx,
		}, nil
	}
}

func (t *TableService) StartService() {
	go func() {
		logrus.Infof("Starting service for table %s", t.ID)
		ticker := time.NewTicker(TimeoutDuration)
		defer func() {
			logrus.Infof("Service for table %s stopped", t.ID)
			ticker.Stop()
			t.AblyClient.Close()
			tableRepo := repository.GetTableRepo()
			err := tableRepo.Delete(t.Ctx, t.ID)
			utils.LogOnError(err)
		}()
		// Initialize the ably client to handle messages and presence
		t.AblyClient.Connection.OnAll(func(change ably.ConnectionStateChange) {
			logrus.Infof("Connection state changed: %s", change.Current)
		})
		//
		t.AblyClient.Connection.Once(ably.ConnectionEventConnected, func(change ably.ConnectionStateChange) {
			t.Channel.SubscribeAll(t.Ctx, func(msg *ably.Message) {
				// Reset the ticker if any activity is detected
				ticker.Reset(TimeoutDuration)
			})
			t.Channel.Subscribe(t.Ctx, "chat", func(msg *ably.Message) {
				logrus.Infof("Received message: %s", msg.Data)
			})
			t.Channel.Presence.SubscribeAll(t.Ctx, func(presence *ably.PresenceMessage) {
				switch presence.Action {
				case ably.PresenceActionEnter:
					logrus.Infof("User %s entered the table", presence.ClientID)
					t.Users[presence.ClientID] = &UserClient{
						ID:      presence.ClientID,
						Present: true,
						Channel: t.AblyClient.Channels.Get(presence.ClientID),
					}
				case ably.PresenceActionLeave:
					logrus.Infof("User %s left the table", presence.ClientID)
					t.Users[presence.ClientID].Present = false
				}
			})
		})
		// Connect to the ably service
		t.AblyClient.Connect()
		for {
			select {
			case <-ticker.C:
				// Stop the service if no activity is detected for a certain duration
				logrus.Infof("Service for table %s timed out", t.ID)
				// Inform any clients that the service has timed out
				t.Channel.Publish(t.Ctx, TimeoutEvent, nil)
				return
			case <-t.Ctx.Done():
				logrus.Infof("Service for table %s was ended", t.ID)
				return
			}
		}
	}()
}
