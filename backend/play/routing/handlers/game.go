package handlers

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func NewGame(r *http.Request, p httprouter.Params) (code int, body any) {
	// TODO: Implement
	// 1. Create a new game entity in redis.
	// 2. Create a new game session worker (SessionWorker) for the game.
	// 3. Start the session worker.
	// 4. Return the session ID in the response body.
	return http.StatusOK, nil
}

func ReviveGame(r *http.Request, p httprouter.Params) (code int, body any) {
	// TODO: Implement
	// 1. Get the session ID from the URL parameters.
	// 2. Check if the session ID exists in redis.
	// 3. If it exists, create a new game session worker (SessionWorker) for the game.
	// 4. Start the session worker.
	// 5. Return the session ID in the response body.
	// 6. If it doesn't exist, return a 404 status code.
	return http.StatusOK, nil
}
