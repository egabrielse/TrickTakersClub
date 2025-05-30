package clients

import (
	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client

// InitRedisClient initializes the Redis Client with the given host, port, user, and password
func InitRedisClient(host string, port string, user string, pass string) {
	client := redis.NewClient(&redis.Options{
		Addr:     host + ":" + port,
		Username: user,
		Password: pass,
		DB:       0,  // use default DB
		PoolSize: 10, // set pool size
	})
	redisClient = client
}

// GetRedisClient returns the Redis client
func GetRedisClient() *redis.Client {
	return redisClient
}
