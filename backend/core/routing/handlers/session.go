package handlers

import (
	"net/http"
	"storage/repository"

	"github.com/julienschmidt/httprouter"
)

// FetchSessionList returns a list of all active sessions.
func FetchSessionList(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	sessionRepo := repository.GetSessionRepo()
	if sessions, err := sessionRepo.GetAll(r.Context()); err != nil {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, sessions
	}
}
