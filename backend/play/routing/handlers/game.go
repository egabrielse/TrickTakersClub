package handlers

import (
	"net/http"
	"play/app/session"
	"storage/entity"
	"storage/repository"

	"github.com/julienschmidt/httprouter"
	"github.com/redis/go-redis/v9"
)

func NewGame(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	// Create session worker to run the game.
	entity := entity.NewSession(uid)
	worker := session.NewSessionWorker(entity)
	// Start the session worker.
	worker.StartWorker()
	return http.StatusOK, entity
}

func ReviveGame(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	gameID := p.ByName("gameId")
	gameRepo := repository.GetGameRepo()

	if game, err := gameRepo.Get(r.Context(), gameID); err == redis.Nil {
		return http.StatusNotFound, nil
	} else if err != nil {
		return http.StatusInternalServerError, nil
	} else {
		// Create a new session worker for the game.
		entity := entity.NewSession(uid)
		entity.ResumeGame(game)
		worker := session.NewSessionWorker(entity)
		// Start the session worker.
		worker.StartWorker()
		return http.StatusOK, entity
	}
}
