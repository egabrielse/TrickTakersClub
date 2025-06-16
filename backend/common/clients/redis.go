package clients

import (
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

var redisClient *redis.Client

// InitRedisClient initializes the Redis Client with the given host, port, user, and password
func InitRedisClient(host string, port string, pass string) *redis.Client {
	logrus.Info("Initializing Redis client")
	logrus.Infof("Redis host: %s, port: %s", host, port)
	logrus.Infof("Redis password: %s", pass)

	client := redis.NewClient(&redis.Options{
		Addr:     host + ":" + port,
		Password: pass,
		DB:       0,  // use default DB
		PoolSize: 10, // set pool size
	})
	redisClient = client
	return redisClient
}

// GetRedisClient returns the global Redis client
func GetRedisClient() *redis.Client {
	return redisClient
}
