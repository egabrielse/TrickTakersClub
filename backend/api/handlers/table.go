package handlers

import (
	"main/domain/entity"
	"main/domain/repository"
	"main/domain/service"
	"main/utils"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type CreateTableResponseBody struct {
	ID string `json:"id"`
}

func CreateTable(r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	tableRepo := repository.GetTableRepo()
	if tableEntity, err := entity.NewTableEntity(uid); err != nil {
		return http.StatusInternalServerError, nil
	} else if err := tableRepo.Save(r.Context(), tableEntity); err != nil {
		return http.StatusInternalServerError, nil
	} else if tableService, err := service.NewTableWorker(tableEntity); utils.LogOnError(err) {
		return http.StatusInternalServerError, nil
	} else {
		tableService.StartService()
		return http.StatusCreated, CreateTableResponseBody{ID: tableEntity.ID}
	}
}

func GetTable(r *http.Request, p httprouter.Params) (code int, body any) {
	tableRepo := repository.GetTableRepo()
	if table, err := tableRepo.Get(r.Context(), p.ByName("id")); utils.LogOnError(err) {
		return http.StatusNotFound, nil
	} else {
		return http.StatusOK, table
	}
}

func DeleteTable(r *http.Request, p httprouter.Params) (code int, body any) {
	tableRepo := repository.GetTableRepo()
	if err := tableRepo.Delete(r.Context(), p.ByName("id")); utils.LogOnError(err) {
		return http.StatusNotFound, nil
	} else {
		return http.StatusNoContent, nil
	}
}
