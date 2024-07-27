package handlers

import (
	"main/infrastructure"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type HealthCheckResponseBody struct {
	Redis        bool `json:"redis"`
	FirebaseAuth bool `json:"firebaseAuth"`
}

// HealthCheck is a handler function that returns the health status of the application
func HealthCheck(r *http.Request, p httprouter.Params) (code int, body any) {
	statuses := HealthCheckResponseBody{
		Redis:        false,
		FirebaseAuth: false,
	}
	// Check if Redis is connected
	rdb := infrastructure.GetRedisClient()
	if _, err := rdb.Ping(r.Context()).Result(); err == nil {
		statuses.Redis = true
	}

	if auth := infrastructure.GetFirebaseAuth(); auth != nil {
		statuses.FirebaseAuth = true
	}
	return http.StatusOK, statuses
}
