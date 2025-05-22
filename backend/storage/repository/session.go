package repository

import (
	"context"
	"storage/entity"
	"time"
)

var sessionRepo SessionRepo

type SessionRepo interface {
	Exists(ctx context.Context, sessionID string) (bool, error)
	Get(ctx context.Context, sessionID string) (*entity.Session, error)
	GetAll(ctx context.Context) ([]*entity.Session, error)
	Set(ctx context.Context, sessionID string, entity *entity.Session) error
	SetExpiration(ctx context.Context, sessionID string, expiration time.Duration) error
	SetExpirationAt(ctx context.Context, sessionID string, expiration time.Duration) error
	Delete(ctx context.Context, sessionID string) error
}

func InitSessionRepo(s SessionRepo) {
	sessionRepo = s
}

func GetSessionRepo() SessionRepo {
	return sessionRepo
}
