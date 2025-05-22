package decorators

import (
	"common/request"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/sirupsen/logrus"
)

func RequestLogging(handler request.RequestHandler) request.RequestHandler {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) (int, any) {
		// Call the inner handler function to get the response status code and body.
		status, body := handler(w, r, p)

		// Log request information (not including parameters, which could contain sensitive information).
		logrus.WithFields(logrus.Fields{
			"method": r.Method,
			"path":   r.URL.Path,
			"status": status,
		}).Info()

		// Return the response status status and body.
		return status, body
	}
}
