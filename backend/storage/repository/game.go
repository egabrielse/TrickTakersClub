package repository

import (
	"context"
	"storage/entity"
	"time"
)

var gameRepo GameRepo

type GameRepo interface {
	Exists(ctx context.Context, gameID string) (bool, error)
	Get(ctx context.Context, gameID string) (*entity.GameRecord, error)
	GetAll(ctx context.Context) ([]*entity.GameRecord, error)
	Set(ctx context.Context, entity *entity.GameRecord, expiration time.Duration) error
	SetExpiration(ctx context.Context, gameID string, expiration time.Duration) error
	Delete(ctx context.Context, gameID string) error
}

func InitGameRepo(s GameRepo) {
	gameRepo = s
}

func GetGameRepo() GameRepo {
	return gameRepo
}
