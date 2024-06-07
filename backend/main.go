package main

import (
	"main/api"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/sirupsen/logrus"
)

func main() {
	// Set seed for random number generator
	rand.Seed(time.Now().UnixNano())

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + os.Getenv("BACKEND_PORT")
	logrus.Fatal(http.ListenAndServe(port, *router))
}
