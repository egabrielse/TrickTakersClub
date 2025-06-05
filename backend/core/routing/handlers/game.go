package handlers

import (
	"net/http"
	"sheepshead"
	"storage/repository"

	"github.com/julienschmidt/httprouter"
)

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
