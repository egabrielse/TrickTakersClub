package handlers

import (
	"main/domain/entity"
	"main/domain/repository"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type CreateTableResponseBody struct {
	ID string `json:"id"`
}

func CreateTable(r *http.Request, p httprouter.Params) (code int, body any) {
	uid := p.ByName("uid")
	table := entity.NewTableEntity(uid)
	tableRepo := repository.GetTableRepo()
	if err := tableRepo.Save(r.Context(), table); err != nil {
		return http.StatusInternalServerError, nil
	}
	return http.StatusCreated, CreateTableResponseBody{ID: table.ID}
}

func GetTable(r *http.Request, p httprouter.Params) (code int, body any) {
	tableRepo := repository.GetTableRepo()
	if table, err := tableRepo.Get(r.Context(), p.ByName("id")); err != nil {
		return http.StatusNotFound, nil
	} else {
		return http.StatusOK, table
	}
}

func GetAllTables(r *http.Request, p httprouter.Params) (code int, body any) {
	tableRepo := repository.GetTableRepo()
	if tables, err := tableRepo.GetAll(r.Context()); err != nil {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, tables
	}
}
