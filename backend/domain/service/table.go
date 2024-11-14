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
const TimeoutDuration = time.Minute * 5

// TableService represents the service for controlling the table
type TableService struct {
	ID         string `json:"id"`
	HostID     string `json:"hostId"`
	channel    *ably.RealtimeChannel
	client     *ably.Realtime
	ctx        context.Context
	lastUpdate time.Time
}

func NewTableService(tableId string, hostId string) (*TableService, error) {
	ctx := context.Background()
	key := utils.GetEnvironmentVariable("ABLY_API_KEY")

	options := []ably.ClientOption{
		ably.WithKey(key),
		ably.WithAutoConnect(false),
		ably.WithEchoMessages(false),
	}
	if client, err := ably.NewRealtime(options...); utils.LogOnError(err) {
		return nil, err
	} else {
		return &TableService{
			ID:         tableId,
			HostID:     hostId,
			channel:    client.Channels.Get(tableId),
			client:     client,
			ctx:        ctx,
			lastUpdate: time.Now(),
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
			t.client.Close()
			tableRepo := repository.GetTableRepo()
			err := tableRepo.Delete(t.ctx, t.ID)
			utils.LogOnError(err)
		}()
		// Initialize the ably client to handle messages and presence
		t.client.Connection.OnAll(func(change ably.ConnectionStateChange) {
			logrus.Infof("Connection state changed: %s", change.Current)
		})
		//
		t.client.Connection.Once(ably.ConnectionEventConnected, func(change ably.ConnectionStateChange) {
			t.channel.SubscribeAll(t.ctx, func(msg *ably.Message) {
				// Reset the ticker if any activity is detected
				ticker.Reset(TimeoutDuration)
			})
			t.channel.Subscribe(t.ctx, "chat", func(msg *ably.Message) {
				logrus.Infof("Received message: %s", msg.Data)
			})
			t.channel.Presence.SubscribeAll(t.ctx, func(presence *ably.PresenceMessage) {
				logrus.Infof("Presence message: %s", presence.Action)
			})
		})
		// Connect to the ably service
		t.client.Connect()
		for {
			select {
			case <-ticker.C:
				// Stop the service if no activity is detected for a certain duration
				logrus.Infof("Service for table %s timed out", t.ID)
				// Inform any clients that the service has timed out
				t.channel.Publish(t.ctx, "timeout", nil)
				return
			case <-t.ctx.Done():
				logrus.Infof("Service for table %s was ended", t.ID)
				return
			}
		}
	}()
}
