package handlers

import (
	"main/infrastructure"
	"main/utils"
	"net/http"

	"firebase.google.com/go/v4/auth"
	"github.com/julienschmidt/httprouter"
)

type GetUserResponseBody struct {
	User *auth.UserInfo `json:"user"`
}

func GetUserByID(r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("id")
	client := infrastructure.GetFirebaseAuth()
	if userRecord, err := client.GetUser(r.Context(), uid); utils.LogOnError(err) {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, GetUserResponseBody{User: userRecord.UserInfo}
	}
}
