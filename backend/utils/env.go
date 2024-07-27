package utils

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// LoadEnvironmentVariables loads environment variables from a .env
func LoadEnvironmentVariables() {
	err := godotenv.Load(".env")
	LogOnError(err)
}

// GetEnvironmentVariable retrieves an environment variable by key
func GetEnvironmentVariable(key string) string {
	variable := os.Getenv(key)
	if variable == "" {
		logrus.Fatalf("Environment variable %s not found", key)
	}
	return variable
}
