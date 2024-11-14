package infrastructure

import (
	"log"
	"main/utils"

	"github.com/ably/ably-go/ably"
)

var ablyClient *ably.REST

// InitAblyClient initializes the Ably client
func InitAblyRestClient() {
	key := utils.GetEnvironmentVariable("ABLY_API_KEY")
	options := []ably.ClientOption{ably.WithKey(key)}
	if client, err := ably.NewREST(options...); utils.LogOnError(err) {
		log.Fatalf("error initializing ably: %v\n", err)
		return
	} else {
		ablyClient = client
	}
}

// GetFirebaseAuth returns the Firebase auth client
func GetAblyClient() *ably.REST {
	return ablyClient
}
