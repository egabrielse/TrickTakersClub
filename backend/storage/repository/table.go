package repository

import (
	"context"
	"storage/entity"
)

type TableRepo interface {
	Get(ctx context.Context, ID string) (*entity.TableEntity, error)
	Delete(ctx context.Context, ID string) error
	Save(ctx context.Context, table *entity.TableEntity) error
}

var tableRepo TableRepo

func GetTableRepo() TableRepo {
	return tableRepo
}

func InitTableRepo(r TableRepo) {
	tableRepo = r
}
