package utils

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// GetEnvVariable returns the value of an environment variable
func GetEnvVariable(key string) string {
	if err := godotenv.Load(".env"); err != nil {
		logrus.Error("Error loading .env file")
	}
	return os.Getenv(key)
}
