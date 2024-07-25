package main

import (
	"main/api"
	"main/infrastructure"
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

	// Initialize Firebase app
	infrastructure.InitFirebaseApp()

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + os.Getenv("PORT")
	logrus.Fatal(http.ListenAndServe(port, *router))
}
