package main

import (
	"common/clients"
	"common/env"
	"common/logging"
	"net/http"
	"play/routing"
	"storage/implementation"
	"storage/repository"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables
	env.LoadEnvFile()

	// Configure logger
	logging.ConfigureLogger()

	// Initialize Firebase app (used for authentication)
	projectID := env.GetEnvVar("FIREBASE_PROJECT_ID")
	clients.InitFirebaseClients(projectID)

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
	logrus.Infof("Play service listening on port: %s", port)
	logrus.Fatal(http.ListenAndServe(port, *router))
}
