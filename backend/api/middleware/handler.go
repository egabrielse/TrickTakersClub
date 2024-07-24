package middleware

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// RequestHandler is a function that handles an HTTP request and returns a response code and body.
type RequestHandler func(r *http.Request, p httprouter.Params) (status int, body any)

// RequestHandlerDecorator is a function that takes a RequestHandler and returns a new RequestHandler.
type RequestHandlerDecorator func(RequestHandler) RequestHandler

// HandleWith returns an httprouter.Handle function that executes the given handler with the given decorators.
func HandleWith(handler RequestHandler, decorators ...RequestHandlerDecorator) httprouter.Handle {
	// Apply decorators to handler.
	for i := range decorators {
		// Apply decorators in reverse order so that the first listed decorator is the first to be executed.
		d := decorators[len(decorators)-1-i]
		handler = d(handler)
	}

	// Return base httprouter.Handle function, which handles writing the response.
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		// Call handler
		status, body := handler(r, p)

		// Marshal response body.
		if marshalledBody, err := json.Marshal(body); err != nil {
			// Error marshalling response.
			status = http.StatusInternalServerError
		} else {
			// Construct response from returned code and body.
			w.WriteHeader(status)
			w.Write(marshalledBody)
		}
	}
}
