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

		fields := logrus.Fields{
			"method": r.Method,
			"path":   r.URL.Path,
			"status": status,
		}

		if status >= 400 {
			logrus.WithFields(fields).Error()
		} else {
			logrus.WithFields(fields).Info()
		}

		// Return the response status status and body.
		return status, body
	}
}
