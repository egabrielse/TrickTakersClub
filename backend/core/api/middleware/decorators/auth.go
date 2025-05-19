package decorators

import (
	"main/api/middleware"
	"main/infrastructure"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/sirupsen/logrus"
)

// TokenAuthentication is a decorator that checks if the request has a valid token
func TokenAuthentication(handler middleware.RequestHandler) middleware.RequestHandler {
	return func(r *http.Request, p httprouter.Params) (int, any) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			return http.StatusUnauthorized, "Missing authorization header"
		}
		tokenString = tokenString[len("Bearer "):]
		auth := infrastructure.GetFirebaseAuth()
		if token, err := auth.VerifyIDToken(r.Context(), tokenString); err != nil {
			logrus.Error(err)
			return http.StatusUnauthorized, "Invalid token"
		} else {
			p = append(p, httprouter.Param{
				Key:   "uid",
				Value: token.UID,
			})
			return handler(r, p)
		}
	}
}
