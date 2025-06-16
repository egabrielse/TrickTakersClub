package handlers

import (
	"common/logging"
	"io"
	"net/http"
	"storage/entity"
	"storage/repository"

	"github.com/julienschmidt/httprouter"
)

type CreateSettingsResponseBody struct {
	Settings entity.Settings `json:"settings"`
}

func SaveSettings(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	UID := p.ByName("uid")
	repo := repository.GetSettingsRepo()
	entity := &entity.Settings{}
	if body, err := io.ReadAll(r.Body); err != nil {
		return http.StatusInternalServerError, err
	} else if err := entity.UnmarshalBinary(body); err != nil {
		return http.StatusBadRequest, nil
	} else if err := repo.Save(r.Context(), UID, entity); err != nil {
		return http.StatusInternalServerError, err
	} else {
		return http.StatusOK, &entity
	}
}

func GetSettings(w http.ResponseWriter, r *http.Request, p httprouter.Params) (code int, body any) {
	UID := p.ByName("uid")
	repo := repository.GetSettingsRepo()
	if entity, err := repo.Get(r.Context(), UID); logging.LogOnError(err) {
		return http.StatusInternalServerError, err
	} else {
		return http.StatusOK, entity
	}
}
