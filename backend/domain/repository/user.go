package repository

import (
	"context"
	"main/domain/entity"
)

type UserRepo interface {
	Get(ctx context.Context, ID string) (*entity.UserEntity, error)
	GetAll(ctx context.Context) ([]*entity.UserEntity, error)
	Save(ctx context.Context, user *entity.UserEntity) error
}

var userRepo UserRepo

func GetUserRepo() UserRepo {
	return userRepo
}

func InitUserRepo(r UserRepo) {
	userRepo = r
}
