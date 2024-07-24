package decorators

import (
	"main/api/middleware"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/sirupsen/logrus"
)

func RequestLogging(handler middleware.RequestHandler) middleware.RequestHandler {
	return func(r *http.Request, p httprouter.Params) (int, any) {
		// Call the inner handler function to get the response status code and body.
		status, body := handler(r, p)

		// Log request information (not including parameters, which could contain sensitive information).
		logrus.WithFields(logrus.Fields{
			"timestamp": time.Now().Format(time.RFC3339),
			"method":    r.Method,
			"path":      r.URL.Path,
			"status":    status,
		}).Info()

		// Return the response status status and body.
		return status, body
	}
}
