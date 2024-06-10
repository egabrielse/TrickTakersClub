package handlers

import (
	"encoding/json"
	"main/domain/entity"
	"main/domain/repository"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type CreateUserResponseBody struct {
	ID string `json:"id"`
}

func CreateUser(r *http.Request, p httprouter.Params) (code int, body any) {
	var userDetails struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userDetails); err != nil {
		return http.StatusBadRequest, nil
	}
	user := entity.NewUserEntity(userDetails.Name, userDetails.Email)
	userRepo := repository.GetUserRepo()
	if err := userRepo.Save(r.Context(), user); err != nil {
		return http.StatusInternalServerError, nil
	}
	return http.StatusCreated, CreateUserResponseBody{ID: user.ID}
}

func GetUser(r *http.Request, p httprouter.Params) (code int, body any) {
	userRepo := repository.GetUserRepo()
	if user, err := userRepo.Get(r.Context(), p.ByName("id")); err != nil {
		return http.StatusNotFound, nil
	} else {
		return http.StatusOK, user
	}
}

func GetAllUsers(r *http.Request, p httprouter.Params) (code int, body any) {
	userRepo := repository.GetUserRepo()
	if users, err := userRepo.GetAll(r.Context()); err != nil {
		return http.StatusInternalServerError, nil
	} else {
		return http.StatusOK, users
	}
}
