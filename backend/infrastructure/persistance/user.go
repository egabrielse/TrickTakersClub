package persistance

import (
	"context"
	"main/domain/entity"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

const ExpirationUser = 0

func createUserKey(id string) string {
	return "user:" + id
}

type UserRepoImplementation struct {
	rdb *redis.Client
}

func NewUserRepoImplementation(rdb *redis.Client) *UserRepoImplementation {
	return &UserRepoImplementation{rdb: rdb}
}

// Get returns the user entity from the redis cache
func (r *UserRepoImplementation) Get(ctx context.Context, ID string) (*entity.UserEntity, error) {
	var user entity.UserEntity
	if result, err := r.rdb.Get(ctx, createUserKey(ID)).Result(); err != nil {
		return nil, err
	} else if err := user.UnmarshalBinary([]byte(result)); err != nil {
		return nil, err
	} else {
		return &user, nil
	}
}

// GetAll returns all the user entities from the redis cache
func (r *UserRepoImplementation) GetAll(ctx context.Context) ([]*entity.UserEntity, error) {
	if keys, err := r.rdb.Keys(ctx, createUserKey("*")).Result(); err != nil {
		return nil, err
	} else {
		users := make([]*entity.UserEntity, len(keys))
		for i, key := range keys {
			user := &entity.UserEntity{}
			if result, err := r.rdb.Get(ctx, key).Result(); err != nil {
				continue
			} else if err := user.UnmarshalBinary([]byte(result)); err != nil {
				logrus.Error(err)
				return nil, err
			} else {
				users[i] = user
			}
		}
		return users, nil
	}
}

// Save saves the user entity to the redis cache
func (r *UserRepoImplementation) Save(ctx context.Context, user *entity.UserEntity) error {
	if _, err := r.rdb.Set(ctx, createUserKey(user.ID), user, ExpirationUser).Result(); err != nil {
		return err
	}
	return nil
}
