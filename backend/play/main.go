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
	if err := clients.InitFirebaseClients(projectID); err != nil {
		logrus.Fatal("Error initializing Firebase clients: ", err)
	}

	// Initialize Redis client
	redisAddr := env.GetEnvVar("REDIS_ADDR")
	redisPass := env.GetEnvVar("REDIS_PASS")
	redisCert := env.GetEnvVar("REDIS_CERT")
	if err := clients.InitRedisClient(redisAddr, redisPass, redisCert); err != nil {
		logrus.Fatal("Error initializing Redis client: ", err)
	}
	rdb := clients.GetRedisClient()

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
