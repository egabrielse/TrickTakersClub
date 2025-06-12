package handlers

import (
	"net/http"
	"play/app/session"
	"storage/entity"
	"storage/repository"

	"github.com/julienschmidt/httprouter"
	"github.com/redis/go-redis/v9"
)

type NewGameSessionResponse struct {
	SessionID string `json:"sessionId"` // The ID of the newly created game session
}

// NewGameSession creates a new game session.
func NewGameSession(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	// Create session worker to run the game.
	entity := entity.NewSession(uid)
	worker := session.NewSessionWorker(entity)
	// Start the session worker.
	worker.StartWorker()
	return http.StatusOK, &NewGameSessionResponse{SessionID: entity.ID}
}

type ReviveGameResponse struct {
	SessionID string `json:"sessionId"` // The ID of the newly created game session
}

func ReviveGame(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	gameID := p.ByName("gameId")
	gameRepo := repository.GetGameRepo()
	if game, err := gameRepo.Get(r.Context(), gameID); err == redis.Nil {
		return http.StatusNotFound, nil
	} else if err != nil {
		return http.StatusInternalServerError, err
	} else {
		// Create a new session worker for the game.
		entity := entity.NewSession(uid)
		entity.ResumeGame(&game.Game)
		worker := session.NewSessionWorker(entity)
		// Start the session worker.
		worker.StartWorker()
		return http.StatusOK, &ReviveGameResponse{SessionID: entity.ID}
	}
}
