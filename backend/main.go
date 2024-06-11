package main

import (
	"errors"
	"main/api"
	"main/infrastructure/persistance"
	"main/utils"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

func main() {
	// Load environment variables from .env file if it exists
	if _, err := os.Stat(".env"); errors.Is(err, os.ErrNotExist) {
		logrus.Info("No .env file found")
	} else if err := godotenv.Load(".env"); utils.LogOnError(err) {
		return
	}

	// Configure logger
	utils.ConfigureLogrus()

	// Set seed for random number generator
	rand.Seed(time.Now().UnixNano())

	// Initialize Redis client
	persistance.InitRedisCache()

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + os.Getenv("PORT")
	logrus.Fatal(http.ListenAndServe(port, *router))
}
