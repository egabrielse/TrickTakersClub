package clients

import (
	"crypto/tls"
	"crypto/x509"
	"errors"

	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client

// InitRedisClient initializes the Redis Client with the given host, port, user, and password
func InitRedisClient(addr, pass, cert string) error {
	options := &redis.Options{
		Addr:     addr,
		Password: pass,
		DB:       0,  // use default DB
		PoolSize: 10, // set pool size
	}
	if cert != "" {
		// If TLS certificate is provided, configure TLS
		options.TLSConfig = &tls.Config{}
		certPool := x509.NewCertPool()
		if !certPool.AppendCertsFromPEM([]byte(cert)) {
			return errors.New("failed to append Redis TLS certificate")
		}
		options.TLSConfig.RootCAs = certPool
	}
	redisClient = redis.NewClient(options)
	return nil
}

// GetRedisClient returns the global Redis client
func GetRedisClient() *redis.Client {
	return redisClient
}
