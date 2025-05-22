package main

import (
	"common/clients"
	"common/env"
	"common/logging"
	"net/http"
	"play/routing"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables
	env.LoadEnvironmentVariables()

	// Configure logger
	logging.ConfigureLogger()

	// Initialize Firebase app (used for authentication)
	projectID := env.GetEnvironmentVariable("FIREBASE_PROJECT_ID")
	clients.InitFirebaseClients(projectID)

	// Initialize Ably client
	key := env.GetEnvironmentVariable("ABLY_API_KEY")
	clients.InitAblyRestClient(key)

	// Initialize router
	router := routing.InitRouter()

	// Start listening for requests
	port := ":" + env.GetEnvironmentVariable("PORT")
	logrus.Infof("Play service listening on port: %s", port)
	logrus.Fatal(http.ListenAndServe(port, *router))
}
