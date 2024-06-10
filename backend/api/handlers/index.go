package handlers

import (
	"main/infrastructure/persistance"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// HealthCheck is a handler function that returns a 200 OK response.
// Its purpose is to check if the server is running.
func HealthCheck(r *http.Request, p httprouter.Params) (code int, body any) {
	rdb := persistance.GetRedisClient()
	if _, err := rdb.Ping(r.Context()).Result(); err != nil {
		return http.StatusInternalServerError, nil
	}
	return http.StatusOK, nil
}
