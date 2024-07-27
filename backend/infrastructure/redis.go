package infrastructure

import (
	"main/utils"

	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

// InitRedisClient initializes the Redis client
func InitRedisClient() {
	addr := utils.GetEnvironmentVariable("REDIS_HOST")
	user := utils.GetEnvironmentVariable("REDIS_USER")
	pass := utils.GetEnvironmentVariable("REDIS_PASS")

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
