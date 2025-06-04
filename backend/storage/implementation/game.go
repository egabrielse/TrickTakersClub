package implementation

import (
	"context"
	"sheepshead"
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

func (imp *GameRepoRedisImplementation) Set(ctx context.Context, entity *sheepshead.Game, expiration time.Duration) error {
	key := GameRepoRedisKeyPrefix + entity.ID
	if err := imp.db.Set(ctx, key, entity, expiration).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *GameRepoRedisImplementation) Get(ctx context.Context, gameID string) (*sheepshead.Game, error) {
	key := GameRepoRedisKeyPrefix + gameID
	if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
		return nil, err
	} else {
		entity := &sheepshead.Game{}
		if err := entity.UnmarshalBinary(data); err != nil {
			return nil, err
		}
		return entity, nil
	}
}

func (imp *GameRepoRedisImplementation) GetAll(ctx context.Context) ([]*sheepshead.Game, error) {
	pattern := GameRepoRedisKeyPrefix + "*"
	if keys, err := imp.db.Keys(ctx, pattern).Result(); err != nil {
		return nil, err
	} else {
		games := make([]*sheepshead.Game, 0)
		for _, key := range keys {
			if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
				return nil, err
			} else {
				entity := &sheepshead.Game{}
				if err := entity.UnmarshalBinary(data); err != nil {
					return nil, err
				}
				games = append(games, entity)
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
