package service

import (
	"context"
	"errors"

	"github.com/ably/ably-go/ably"
	"github.com/sirupsen/logrus"
)

type UserClient struct {
	ID            string                `json:"id"`
	ConnectionIDs []string              `json:"connectionIds"`
	ChannelName   string                `json:"channelName"`
	ably          *ably.Realtime        `json:"-"`
	channel       *ably.RealtimeChannel `json:"-"`
	unsubscribe   func()                `json:"-"`
}

func NewUserClient(uid string, tid string, ably *ably.Realtime) *UserClient {
	return &UserClient{
		ID:            uid,
		ConnectionIDs: []string{},
		ChannelName:   tid + ":" + uid,
		ably:          ably,
		channel:       ably.Channels.Get(tid + ":" + uid),
		unsubscribe:   nil,
	}
}

func (u *UserClient) Enter(ctx context.Context, connectionId string, handler func(*ably.Message)) error {
	logrus.Infof("User %s (%s) entering", u.ID, connectionId)
	// Only attach and subscribe once per user (not per connection)
	if len(u.ConnectionIDs) == 0 {
		// Create the channel if not already created
		if u.channel == nil {
			u.channel = u.ably.Channels.Get(u.ChannelName)
		}
		// Register the handler to receive messages
		if unsubscribe, err := u.channel.SubscribeAll(ctx, handler); err != nil {
			return err
		} else {
			u.unsubscribe = unsubscribe
		}
	}
	// Add the connection ID to the list
	u.ConnectionIDs = append(u.ConnectionIDs, connectionId)
	return nil
}

func (u *UserClient) Leave(ctx context.Context, connectionId string) {
	logrus.Infof("User %s (%s) leaving", u.ID, connectionId)
	// Remove the connection ID from the list
	for i, id := range u.ConnectionIDs {
		if id == connectionId {
			u.ConnectionIDs = append(u.ConnectionIDs[:i], u.ConnectionIDs[i+1:]...)
		}
	}
	// If there are no more connection IDs, detach the channel
	if len(u.ConnectionIDs) == 0 {
		// Detach the channel, to stop receiving messages
		if u.channel != nil {
			u.channel.Detach(ctx)
		}
		// Remove the unsubscribe function
		if u.unsubscribe != nil {
			u.unsubscribe()
		}
	}
}

func (u *UserClient) Publish(ctx context.Context, event string, data interface{}) error {
	logrus.Infof("Publishing %s to user channel (%s)", event, u.ID)
	if len(u.ConnectionIDs) == 0 {
		return errors.New("user not present")
	} else if err := u.channel.Publish(ctx, event, data); err != nil {
		return err
	}
	return nil
}
