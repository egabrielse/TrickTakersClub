package repository

import (
	"context"
	"sheepshead"
	"time"
)

var gameRepo GameRepo

type GameRepo interface {
	Exists(ctx context.Context, gameID string) (bool, error)
	Get(ctx context.Context, gameID string) (*sheepshead.Game, error)
	GetAll(ctx context.Context) ([]*sheepshead.Game, error)
	Set(ctx context.Context, entity *sheepshead.Game, expiration time.Duration) error
	SetExpiration(ctx context.Context, gameID string, expiration time.Duration) error
	Delete(ctx context.Context, gameID string) error
}

func InitGameRepo(s GameRepo) {
	gameRepo = s
}

func GetGameRepo() GameRepo {
	return gameRepo
}
