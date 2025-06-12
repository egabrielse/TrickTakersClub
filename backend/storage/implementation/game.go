package implementation

import (
	"context"
	"storage/entity"
	"time"

	"github.com/redis/go-redis/v9"
)

const GameRepoRedisKeyPrefix = "game:"

type GameRepoRedisImplementation struct {
	db *redis.Client
}

func NewGameRepoRedisImplementation(db *redis.Client) *GameRepoRedisImplementation {
	return &GameRepoRedisImplementation{db: db}
}

func (imp *GameRepoRedisImplementation) Exists(ctx context.Context, gameID string) (bool, error) {
	key := GameRepoRedisKeyPrefix + gameID
	if count, err := imp.db.Exists(ctx, key).Result(); err != nil {
		return false, err
	} else {
		return count > 0, nil
	}
}

func (imp *GameRepoRedisImplementation) Set(ctx context.Context, ent *entity.GameRecord, expiration time.Duration) error {
	key := GameRepoRedisKeyPrefix + ent.ID
	if err := imp.db.Set(ctx, key, ent, expiration).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *GameRepoRedisImplementation) Get(ctx context.Context, gameID string) (*entity.GameRecord, error) {
	key := GameRepoRedisKeyPrefix + gameID
	if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
		return nil, err
	} else {
		ent := &entity.GameRecord{}
		if err := ent.UnmarshalBinary(data); err != nil {
			return nil, err
		}
		return ent, nil
	}
}

func (imp *GameRepoRedisImplementation) GetAll(ctx context.Context) ([]*entity.GameRecord, error) {
	pattern := GameRepoRedisKeyPrefix + "*"
	if keys, err := imp.db.Keys(ctx, pattern).Result(); err != nil {
		return nil, err
	} else {
		games := make([]*entity.GameRecord, 0)
		for _, key := range keys {
			if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
				return nil, err
			} else {
				ent := &entity.GameRecord{}
				if err := ent.UnmarshalBinary(data); err != nil {
					return nil, err
				}
				games = append(games, ent)
			}
		}
		return games, nil
	}
}

func (imp *GameRepoRedisImplementation) SetExpiration(ctx context.Context, gameID string, expiration time.Duration) error {
	key := GameRepoRedisKeyPrefix + gameID
	if err := imp.db.Expire(ctx, key, expiration).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *GameRepoRedisImplementation) Delete(ctx context.Context, gameID string) error {
	key := GameRepoRedisKeyPrefix + gameID
	if err := imp.db.Del(ctx, key).Err(); err != nil {
		return err
	}
	return nil
}
