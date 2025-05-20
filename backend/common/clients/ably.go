package clients

import (
	"fmt"

	"github.com/ably/ably-go/ably"
)

var ablyClient *ably.REST

// InitAblyClient initializes the Ably client
func InitAblyRestClient(ablyKey string) {
	options := []ably.ClientOption{ably.WithKey(ablyKey)}
	if client, err := ably.NewREST(options...); err != nil {
		fmt.Printf("Error Initializing Ably Client: %v", err)
		return
	} else {
		ablyClient = client
	}
}

// GetFirebaseAuth returns the Firebase auth client
func GetAblyRestClient() *ably.REST {
	return ablyClient
}
