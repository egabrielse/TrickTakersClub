package implementation

import (
	"context"
	"storage/entity"
	"time"

	"github.com/redis/go-redis/v9"
)

const SessionRepoRedisKeyPrefix = "session:"

type SessionRepoRedisImplementation struct {
	db *redis.Client
}

func NewSessionRepoRedisImplementation(db *redis.Client) *SessionRepoRedisImplementation {
	return &SessionRepoRedisImplementation{db: db}
}

func (imp *SessionRepoRedisImplementation) Exists(ctx context.Context, sessionID string) (bool, error) {
	if count, err := imp.db.Exists(ctx, sessionID).Result(); err != nil {
		return false, err
	} else {
		return count > 0, nil
	}
}

func (imp *SessionRepoRedisImplementation) Set(ctx context.Context, entity *entity.Session) error {
	key := SessionRepoRedisKeyPrefix + entity.ID
	if err := imp.db.Set(ctx, key, entity, 0).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *SessionRepoRedisImplementation) Get(ctx context.Context, sessionID string) (*entity.Session, error) {
	if data, err := imp.db.Get(ctx, sessionID).Bytes(); err != nil {
		return nil, err
	} else {
		entity := &entity.Session{}
		if err := entity.UnmarshalBinary(data); err != nil {
			return nil, err
		}
		return entity, nil
	}
}

func (imp *SessionRepoRedisImplementation) GetAll(ctx context.Context) ([]*entity.Session, error) {
	pattern := SessionRepoRedisKeyPrefix + "*"
	if keys, err := imp.db.Keys(ctx, pattern).Result(); err != nil {
		return nil, err
	} else {
		sessions := make([]*entity.Session, 0)
		for _, key := range keys {
			if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
				return nil, err
			} else {
				entity := &entity.Session{}
				if err := entity.UnmarshalBinary(data); err != nil {
					return nil, err
				}
				sessions = append(sessions, entity)
			}
		}
		return sessions, nil
	}
}

func (imp *SessionRepoRedisImplementation) SetExpiration(ctx context.Context, sessionID string, expiration time.Duration) error {
	key := SessionRepoRedisKeyPrefix + sessionID
	if err := imp.db.Expire(ctx, key, expiration).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *SessionRepoRedisImplementation) SetExpirationAt(ctx context.Context, sessionID string, expiration time.Duration) error {
	key := SessionRepoRedisKeyPrefix + sessionID
	if err := imp.db.ExpireAt(ctx, key, time.Now().Add(expiration)).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *SessionRepoRedisImplementation) Delete(ctx context.Context, sessionID string) error {
	key := SessionRepoRedisKeyPrefix + sessionID
	if err := imp.db.Del(ctx, key).Err(); err != nil {
		return err
	}
	return nil
}
