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
	key := SessionRepoRedisKeyPrefix + sessionID
	if count, err := imp.db.Exists(ctx, key).Result(); err != nil {
		return false, err
	} else {
		return count > 0, nil
	}
}

func (imp *SessionRepoRedisImplementation) Set(ctx context.Context, ent *entity.SessionRecord, expiration time.Duration) error {
	key := SessionRepoRedisKeyPrefix + ent.ID
	if err := imp.db.Set(ctx, key, ent, expiration).Err(); err != nil {
		return err
	}
	return nil
}

func (imp *SessionRepoRedisImplementation) Get(ctx context.Context, sessionID string) (*entity.SessionRecord, error) {
	key := SessionRepoRedisKeyPrefix + sessionID
	if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
		return nil, err
	} else {
		ent := &entity.SessionRecord{}
		if err := ent.UnmarshalBinary(data); err != nil {
			return nil, err
		}
		return ent, nil
	}
}

func (imp *SessionRepoRedisImplementation) GetAll(ctx context.Context) ([]*entity.SessionRecord, error) {
	pattern := SessionRepoRedisKeyPrefix + "*"
	if keys, err := imp.db.Keys(ctx, pattern).Result(); err != nil {
		return nil, err
	} else {
		sessions := make([]*entity.SessionRecord, 0)
		for _, key := range keys {
			if data, err := imp.db.Get(ctx, key).Bytes(); err != nil {
				return nil, err
			} else {
				ent := &entity.SessionRecord{}
				if err := ent.UnmarshalBinary(data); err != nil {
					return nil, err
				}
				sessions = append(sessions, ent)
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

func (imp *SessionRepoRedisImplementation) Delete(ctx context.Context, sessionID string) error {
	key := SessionRepoRedisKeyPrefix + sessionID
	if err := imp.db.Del(ctx, key).Err(); err != nil {
		return err
	}
	return nil
}
