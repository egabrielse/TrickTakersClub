package env

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnvironmentVariables loads environment variables from a .env
func LoadEnvironmentVariables() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

// GetEnvironmentVariable retrieves an environment variable by key
func GetEnvironmentVariable(key string) string {
	variable := os.Getenv(key)
	if variable == "" {
		fmt.Printf("Environment variable %s not found\n", key)
	}
	return variable
}
