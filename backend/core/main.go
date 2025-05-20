package main

import (
	"common/clients"
	"common/env"
	"common/logging"
	"main/api"
	"net/http"
	"storage/implementation"
	"storage/repository"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables
	env.LoadEnvironmentVariables()

	// Configure logger
	logging.ConfigureLogger()

	// Initialize Firebase app
	projectID := env.GetEnvironmentVariable("FIREBASE_PROJECT_ID")
	clients.InitFirebaseClients(projectID)

	// Initialize Ably client
	key := env.GetEnvironmentVariable("ABLY_API_KEY")
	clients.InitAblyRestClient(key)

	// Instantiate the Firestore-based repository implementations
	store := clients.GetFirebaseStoreClient()
	repository.InitTableRepo(implementation.NewTableRepoImplementation(store))
	repository.InitSettingsRepo(implementation.NewSettingsRepoImplementation(store))

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + env.GetEnvironmentVariable("PORT")
	logrus.Infof("Listening on port %s", port)
	logrus.Fatal(http.ListenAndServe(port, *router))
}
