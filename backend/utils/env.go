package utils

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// LoadEnvironmentVariables loads environment variables from a .env file if it exists
func LoadEnvironmentVariables() {
	if _, err := os.Stat(".env"); errors.Is(err, os.ErrNotExist) {
		logrus.Info("No .env file found")
	} else if err := godotenv.Load(".env"); LogOnError(err) {
		return
	}
}
