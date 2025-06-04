package decorators

import (
	"common/clients"
	"common/request"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/sirupsen/logrus"
)

// TokenAuthentication is a decorator that checks if the request has a valid token
func TokenAuthentication(handler request.RequestHandler) request.RequestHandler {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) (int, any) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			return http.StatusUnauthorized, "Missing authorization header"
		}
		tokenString = tokenString[len("Bearer "):]
		auth := clients.GetFirebaseAuthClient()
		if token, err := auth.VerifyIDToken(r.Context(), tokenString); err != nil {
			logrus.Error(err)
			return http.StatusUnauthorized, "Invalid token"
		} else {
			p = append(p, httprouter.Param{
				Key:   "uid",
				Value: token.UID,
			})
			return handler(w, r, p)
		}
	}
}

// UrlParamAuthentication is a decorator that checks if the request has a valid token in the URL parameters
// Websockets do not have headers, so we need to check the token in the URL parameters
func UrlParamAuthentication(handler request.RequestHandler) request.RequestHandler {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) (int, any) {
		token := r.URL.Query().Get("token")
		logrus.Info("UrlParamAuthentication: token from URL params:", token)
		if token == "" {
			return http.StatusUnauthorized, "Missing token"
		}
		auth := clients.GetFirebaseAuthClient()
		if token, err := auth.VerifyIDToken(r.Context(), token); err != nil {
			logrus.Error(err)
			return http.StatusUnauthorized, "Invalid token"
		} else {
			p = append(p, httprouter.Param{
				Key:   "uid",
				Value: token.UID,
			})
			return handler(w, r, p)
		}
	}
}
