package main

import (
	"main/api"
	"main/domain/repository"
	"main/infrastructure"
	"main/infrastructure/persistence"
	"main/utils"
	"net/http"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables
	utils.LoadEnvironmentVariables()

	// Configure logger
	utils.ConfigureLogger()

	// Initialize Firebase app
	infrastructure.InitFirebaseApp()

	// Initialize Ably client
	infrastructure.InitAblyRestClient()

	// Instantiate the Firestore-based repository implementations
	store := infrastructure.GetFirebaseStore()
	repository.InitTableRepo(persistence.NewTableRepoImplementation(store))
	repository.InitSettingsRepo(persistence.NewSettingsRepoImplementation(store))

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + utils.GetEnvironmentVariable("PORT")
	logrus.Infof("Listening on port %s", port)
	logrus.Fatal(http.ListenAndServe(port, *router))
}
