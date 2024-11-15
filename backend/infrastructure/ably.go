package infrastructure

import (
	"main/utils"

	"github.com/ably/ably-go/ably"
	"github.com/sirupsen/logrus"
)

var ablyClient *ably.REST

// InitAblyClient initializes the Ably client
func InitAblyRestClient() {
	key := utils.GetEnvironmentVariable("ABLY_API_KEY")
	options := []ably.ClientOption{ably.WithKey(key)}
	if client, err := ably.NewREST(options...); utils.LogOnError(err) {
		logrus.Fatalf("Error Initializing Ably: ", err)
		return
	} else {
		ablyClient = client
	}
}

// GetFirebaseAuth returns the Firebase auth client
func GetAblyClient() *ably.REST {
	return ablyClient
}
