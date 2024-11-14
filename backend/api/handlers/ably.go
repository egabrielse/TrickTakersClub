package handlers

import (
	"main/infrastructure"
	"main/utils"
	"net/http"

	"github.com/ably/ably-go/ably"
	"github.com/julienschmidt/httprouter"
)

type AblyAuthResponseBody struct {
	TokenRequest *ably.TokenRequest `json:"tokenRequest"`
}

// AblyAuth generates an Ably token request for the given user ID
func AblyAuth(r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	ablyClient := infrastructure.GetAblyClient()
	if token, err := ablyClient.Auth.CreateTokenRequest(&ably.TokenParams{ClientID: uid}); utils.LogOnError(err) {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, AblyAuthResponseBody{TokenRequest: token}
	}
}
