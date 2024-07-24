package decorators

import (
	"main/api/middleware"
	"main/infrastructure/firebase"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// TokenAuthentication is a decorator that checks if the request has a valid token
func TokenAuthentication(handler middleware.RequestHandler) middleware.RequestHandler {
	return func(r *http.Request, p httprouter.Params) (int, any) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			return http.StatusUnauthorized, "Missing authorization header"
		}
		tokenString = tokenString[len("Bearer "):]
		app := firebase.GetFirebaseApp()
		if auth, err := app.Auth(r.Context()); err != nil {
			return http.StatusInternalServerError, "Error connecting to auth service"
		} else if token, err := auth.VerifyIDToken(r.Context(), tokenString); err != nil {
			return http.StatusUnauthorized, "Invalid token"
		} else {
			p = append(p, httprouter.Param{
				Key:   "UID",
				Value: token.UID,
			})
			return handler(r, p)
		}
	}
}
