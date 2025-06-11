package main

import (
	"common/clients"
	"common/env"
	"common/logging"
	"main/routing"
	"net/http"
	"storage/implementation"
	"storage/repository"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables
	env.LoadEnvFile()

	// Configure logger
	logging.ConfigureLogger()

	// Initialize Firebase app
	projectID := env.GetEnvVar("FIREBASE_PROJECT_ID")
	clients.InitFirebaseClients(projectID)

	// Instantiate the Firestore-based repository implementations
	store := clients.GetFirebaseStoreClient()
	repository.InitTableRepo(implementation.NewTableRepoImplementation(store))
	repository.InitSettingsRepo(implementation.NewSettingsRepoImplementation(store))

	// Initialize Redis client
	redisHost := env.GetEnvVar("REDIS_HOST")
	redisPort := env.GetEnvVar("REDIS_PORT")
	redisPass := env.GetEnvVar("REDIS_PASS")
	rdb := clients.InitRedisClient(redisHost, redisPort, redisPass)

	// Initialize redis-based storage repositories
	repository.InitSessionRepo(implementation.NewSessionRepoRedisImplementation(rdb))
	repository.InitGameRepo(implementation.NewGameRepoRedisImplementation(rdb))

	// Initialize router
	router := routing.InitRouter()

	// Start listening for requests
	port := ":" + env.GetEnvVar("PORT")
	logrus.Infof("Listening on port %s", port)
	logrus.Fatal(http.ListenAndServe(port, *router))
}
