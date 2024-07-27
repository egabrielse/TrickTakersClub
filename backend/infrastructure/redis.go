package infrastructure

import (
	"os"

	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

// InitRedisCache initializes the Redis client and the Redis-based repository implementations
func InitRedisCache() {
	addr := os.Getenv("REDIS_HOST")
	user := os.Getenv("REDIS_USER")
	pass := os.Getenv("REDIS_PASS")

	// Initialize Redis client
	rdb = redis.NewClient(&redis.Options{
		Addr:     addr,
		Username: user,
		Password: pass,
		DB:       0,
	})
}

// GetRedisClient returns the Redis client
func GetRedisClient() *redis.Client {
	return rdb
}
