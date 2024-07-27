package repository

import (
	"context"
	"main/domain/entity"
)

type TableRepo interface {
	Get(ctx context.Context, ID string) (*entity.TableEntity, error)
	Save(ctx context.Context, user *entity.TableEntity) error
}

var tableRepo TableRepo

func GetTableRepo() TableRepo {
	return tableRepo
}

func InitTableRepo(r TableRepo) {
	tableRepo = r
}
