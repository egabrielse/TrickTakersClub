package handlers

import (
	"main/infrastructure"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type HealthCheckResponseBody struct {
	FirebaseAuth bool `json:"firebaseAuth"`
	Ably         bool `json:"ably"`
	Firestore    bool `json:"firestore"`
}

// HealthCheck is a handler function that returns the health status of the application
func HealthCheck(r *http.Request, p httprouter.Params) (code int, body any) {
	statuses := HealthCheckResponseBody{
		FirebaseAuth: false,
		Ably:         false,
		Firestore:    false,
	}

	if auth := infrastructure.GetFirebaseAuth(); auth != nil {
		statuses.FirebaseAuth = true
	}

	if store := infrastructure.GetFirebaseStore(); store != nil {
		statuses.Ably = true
	}

	if ably := infrastructure.GetAblyClient(); ably != nil {
		statuses.Firestore = true
	}

	return http.StatusOK, statuses
}
