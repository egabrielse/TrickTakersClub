package handlers

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// HealthCheck is a handler function that returns a 200 OK response.
// Its purpose is to check if the server is running.
func HealthCheck(r *http.Request, p httprouter.Params) (code int, body any) {
	return http.StatusOK, "OK"
}
