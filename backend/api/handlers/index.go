package handlers

import (
	"main/infrastructure"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type HealthCheckResponseBody struct {
	FirebaseAuth bool `json:"firebaseAuth"`
}

// HealthCheck is a handler function that returns the health status of the application
func HealthCheck(r *http.Request, p httprouter.Params) (code int, body any) {
	statuses := HealthCheckResponseBody{
		FirebaseAuth: false,
	}

	if auth := infrastructure.GetFirebaseAuth(); auth != nil {
		statuses.FirebaseAuth = true
	}

	return http.StatusOK, statuses
}
