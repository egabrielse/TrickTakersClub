package handlers

import (
	"common/clients"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type HealthCheckResponseBody struct {
	FirebaseAuth bool `json:"firebaseAuth"`
	Firestore    bool `json:"firestore"`
}

// HealthCheck is a handler function that returns the health status of the application
func HealthCheck(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	statuses := HealthCheckResponseBody{
		FirebaseAuth: false,
		Firestore:    false,
	}

	if auth := clients.GetFirebaseAuthClient(); auth != nil {
		statuses.FirebaseAuth = true
	}

	if store := clients.GetFirebaseStoreClient(); store != nil {
		statuses.Firestore = true
	}

	return http.StatusOK, statuses
}
