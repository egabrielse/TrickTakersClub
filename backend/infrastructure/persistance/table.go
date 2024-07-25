package persistance

import (
	"context"
	"main/domain/entity"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

const ExpirationTable = 0

func createKey(id string) string {
	return "table:" + id
}

type TableRepoImplementation struct {
	rdb *redis.Client
}

func NewTableRepoImplementation(rdb *redis.Client) *TableRepoImplementation {
	return &TableRepoImplementation{rdb: rdb}
}

// Get returns the table entity from the redis cache
func (r *TableRepoImplementation) Get(ctx context.Context, ID string) (*entity.TableEntity, error) {
	var table entity.TableEntity
	if result, err := r.rdb.Get(ctx, createKey(ID)).Result(); err != nil {
		return nil, err
	} else if err := table.UnmarshalBinary([]byte(result)); err != nil {
		return nil, err
	} else {
		return &table, nil
	}
}

// GetAll returns all the table entities from the redis cache
func (r *TableRepoImplementation) GetAll(ctx context.Context) ([]*entity.TableEntity, error) {
	if keys, err := r.rdb.Keys(ctx, createKey("*")).Result(); err != nil {
		return nil, err
	} else {
		tables := make([]*entity.TableEntity, len(keys))
		for i, key := range keys {
			table := &entity.TableEntity{}
			if result, err := r.rdb.Get(ctx, key).Result(); err != nil {
				continue
			} else if err := table.UnmarshalBinary([]byte(result)); err != nil {
				logrus.Error(err)
				return nil, err
			} else {
				tables[i] = table
			}
		}
		return tables, nil
	}
}

// Save saves the table entity to the redis cache
func (r *TableRepoImplementation) Save(ctx context.Context, table *entity.TableEntity) error {
	if _, err := r.rdb.Set(ctx, createKey(table.ID), table, ExpirationTable).Result(); err != nil {
		return err
	}
	return nil
}
