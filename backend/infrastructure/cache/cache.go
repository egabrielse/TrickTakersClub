package cache

import (
	"os"

	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

func InitRedisClient() {
	addr := os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT")
	user := os.Getenv("REDIS_USER")
	pass := os.Getenv("REDIS_PASS")

	rdb = redis.NewClient(&redis.Options{
		Addr:     addr,
		Username: user,
		Password: pass,
		DB:       0,
	})
}

func GetRedisClient() *redis.Client {
	return rdb
}
