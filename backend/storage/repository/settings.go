package repository

import (
	"context"
	"storage/entity"
)

type SettingsRepo interface {
	Get(ctx context.Context, UID string) (*entity.Settings, error)
	Save(ctx context.Context, UID string, entity *entity.Settings) error
}

var settingsRepo SettingsRepo

func GetSettingsRepo() SettingsRepo {
	return settingsRepo
}

func InitSettingsRepo(s SettingsRepo) {
	settingsRepo = s
}
