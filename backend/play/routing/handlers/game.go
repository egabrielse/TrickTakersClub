package handlers

import (
	"net/http"
	"play/app/session"
	"sheepshead"
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

// FetchSessionList returns a list of all active sessions.
func FetchSessionList(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	sessionRepo := repository.GetSessionRepo()
	if sessions, err := sessionRepo.GetAll(r.Context()); err != nil {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, sessions
	}
}

// FetchSavedGameList returns any saved games where the host ID matches the provided user ID.
func FetchSavedGameList(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	gameRepo := repository.GetGameRepo()
	if games, err := gameRepo.GetAll(r.Context()); err != nil {
		return http.StatusInternalServerError, nil
	} else {
		// filter games by host ID
		var filteredGames []*sheepshead.Game
		for _, game := range games {
			if game.HostID == uid {
				filteredGames = append(filteredGames, game)
			}
		}
		return http.StatusOK, filteredGames
	}
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
		return http.StatusInternalServerError, nil
	} else {
		// Create a new session worker for the game.
		entity := entity.NewSession(uid)
		entity.ResumeGame(game)
		worker := session.NewSessionWorker(entity)
		// Start the session worker.
		worker.StartWorker()
		return http.StatusOK, &ReviveGameResponse{SessionID: entity.ID}
	}
}
