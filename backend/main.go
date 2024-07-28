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
	utils.ConfigureLogrus()

	// Set seed for random number generator
	rand.Seed(time.Now().UnixNano())

	// Initialize Redis client
	// TODO: Uncomment this line when Redis is needed for pub/sub
	// infrastructure.InitRedisClient()

	// Initialize Firebase app
	infrastructure.InitFirebaseApp()

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
