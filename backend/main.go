package main

import (
	"main/api"
	"main/utils"
	"math/rand"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"
)

func main() {
	// Set seed for random number generator
	rand.Seed(time.Now().UnixNano())

	// Initialize router
	router := api.InitRouter()

	// Start listening for requests
	port := ":" + utils.GetEnvVariable("PORT")
	logrus.Fatal(http.ListenAndServe(port, *router))
}
