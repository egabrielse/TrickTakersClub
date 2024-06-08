package main

import (
	"errors"
	"main/api"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

func main() {
	// 1. Load environment variables from .env file if it exists
	if _, err := os.Stat(".env"); errors.Is(err, os.ErrNotExist) {
		logrus.Info("No .env file found")
	} else if err := godotenv.Load(".env"); err != nil {
		logrus.Error("Error loading .env file")
		return
	}

	// 2. Set seed for random number generator
	rand.Seed(time.Now().UnixNano())

	// 3. Initialize router
	router := api.InitRouter()

	// 4. Start listening for requests
	port := ":" + os.Getenv("PORT")
	logrus.Fatal(http.ListenAndServe(port, *router))
}
