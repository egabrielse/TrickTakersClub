package main

import (
	"main/api"
	"main/domain/repository"
	"main/infrastructure"
	"main/infrastructure/persistance"
	"main/utils"
	"math/rand"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables
	utils.LoadEnvironmentVariables()

	// Configure logger
	utils.ConfigureLogger()

	// Set seed for random number generator
	rand.Seed(time.Now().UnixNano())

	// Initialize Firebase app
	infrastructure.InitFirebaseApp()

	// Initialize Ably client
	infrastructure.InitAblyRestClient()

	// Instantiate the Firestore-based repository implementations
	store := infrastructure.GetFirebaseStore()
	repository.InitTableRepo(persistance.NewTableRepoImplementation(store))

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + utils.GetEnvironmentVariable("PORT")
	logrus.Infof("Listening on port %s", port)
	logrus.Fatal(http.ListenAndServe(port, *router))
}
