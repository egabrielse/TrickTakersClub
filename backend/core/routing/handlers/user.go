package handlers

import (
	"common/clients"
	"common/logging"
	"net/http"

	"firebase.google.com/go/v4/auth"
	"github.com/julienschmidt/httprouter"
)

type GetUserResponseBody struct {
	User *auth.UserInfo `json:"user"`
}

func GetUserByID(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("id")
	client := clients.GetFirebaseAuthClient()
	if userRecord, err := client.GetUser(r.Context(), uid); logging.LogOnError(err) {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, GetUserResponseBody{User: userRecord.UserInfo}
	}
}
