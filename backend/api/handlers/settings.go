package handlers

import (
	"io"
	"main/domain/entity"
	"main/domain/repository"
	"main/utils"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type CreateSettingsResponseBody struct {
	Settings entity.Settings `json:"user_settings"`
}

func SaveSettings(r *http.Request, p httprouter.Params) (code int, body any) {
	UID := p.ByName("uid")
	repo := repository.GetSettingsRepo()
	entity := &entity.Settings{}
	if body, err := io.ReadAll(r.Body); err != nil {
		return http.StatusInternalServerError, nil
	} else if err := entity.UnmarshalBinary(body); err != nil {
		return http.StatusBadRequest, nil
	} else if err := repo.Save(r.Context(), UID, entity); err != nil {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusCreated, &entity
	}
}

func GetSettings(r *http.Request, p httprouter.Params) (code int, body any) {
	UID := p.ByName("uid")
	repo := repository.GetSettingsRepo()
	if entity, err := repo.Get(r.Context(), UID); utils.LogOnError(err) {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, entity
	}
}
