package main

import (
	"main/api"
	"main/domain/repository"
	"main/infrastructure"
	"main/infrastructure/persistance"
	"main/utils"
	"math/rand"
	"net/http"
	"os"
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
	infrastructure.InitRedisCache()

	// Instantiate the Redis-based repository implementations
	rdb := infrastructure.GetRedisClient()
	repository.InitUserRepo(persistance.NewUserRepoImplementation(rdb))

	// Initialize Firebase app
	infrastructure.InitFirebaseApp()

	// Instantiate the Firestore-based repository implementations
	store := infrastructure.GetFirebaseStore()
	repository.InitTableRepo(persistance.NewTableRepoImplementation(store))

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + os.Getenv("PORT")
	logrus.Fatal(http.ListenAndServe(port, *router))
}
