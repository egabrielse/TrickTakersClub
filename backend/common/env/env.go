package env

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

// LoadEnvFile loads environment variables from a .env
func LoadEnvFile() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

// GetEnvVar retrieves an environment variable by key
func GetEnvVar(key string) string {
	variable := os.Getenv(key)
	if variable == "" {
		fmt.Printf("Environment variable %s not found\n", key)
	}
	return variable
}

// GetEnvVarAsDuration retrieves an environment variable as a time.Duration
func GetEnvVarAsDuration(key string, def time.Duration) time.Duration {
	variable := os.Getenv(key)
	if variable == "" {
		fmt.Printf("Environment variable %s not found\n", key)
		return def
	} else if parsed, err := time.ParseDuration(variable); err != nil {
		return def
	} else {
		return parsed
	}
}
