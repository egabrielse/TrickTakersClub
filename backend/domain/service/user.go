package service

import (
	"context"
	"errors"

	"github.com/ably/ably-go/ably"
)

type UserClient struct {
	ID            string                `json:"id"`
	ConnectionIDs []string              `json:"connectionIds"`
	Present       bool                  `json:"present"`
	Channel       *ably.RealtimeChannel `json:"-"`
}

func NewUserClient(uid string, connectionId string, channel *ably.RealtimeChannel) *UserClient {
	return &UserClient{
		ID:            uid,
		ConnectionIDs: []string{connectionId},
		Present:       true,
		Channel:       channel,
	}
}

func (u *UserClient) Enter(ctx context.Context, connectionId string, handler func(*ably.Message)) {
	// If the user is not present, subscribe to all events
	if u.Present {
		u.Channel.SubscribeAll(ctx, handler)
		u.Present = true
	}
	// Add the connection ID to the list
	u.ConnectionIDs = append(u.ConnectionIDs, connectionId)
}

func (u *UserClient) Leave(ctx context.Context, connectionId string) {
	// Remove the connection ID from the list
	for i, id := range u.ConnectionIDs {
		if id == connectionId {
			u.ConnectionIDs = append(u.ConnectionIDs[:i], u.ConnectionIDs[i+1:]...)
			break
		}
	}
	// If there are no more connection IDs, detach the channel
	if len(u.ConnectionIDs) == 0 {
		u.Channel.Detach(ctx)
		u.Present = false
	}
}

func (u *UserClient) Publish(ctx context.Context, event string, data interface{}) error {
	if !u.Present {
		return errors.New("user not present")
	} else if err := u.Channel.Publish(ctx, event, data); err != nil {
		return err
	}
	return nil
}
