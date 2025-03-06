package repository

import (
	"context"
	"main/domain/entity"
)

type UserSettingsRepo interface {
	Get(ctx context.Context, UID string) (*entity.UserSettings, error)
	Save(ctx context.Context, UID string, entity *entity.UserSettings) error
}

var userSettingsRepo UserSettingsRepo

func GetUserSettingsRepo() UserSettingsRepo {
	return userSettingsRepo
}

func InitUserSettingsRepo(us UserSettingsRepo) {
	userSettingsRepo = us
}
