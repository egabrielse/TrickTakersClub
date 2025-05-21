package middleware

import (
	"common/env"
	"net/http"

	"github.com/rs/cors"
)

func SetupCors() *cors.Cors {
	allowedOrigin := env.GetEnvironmentVariable("ALLOWED_ORIGIN")
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{allowedOrigin},
		AllowedMethods: []string{http.MethodPost, http.MethodGet},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	return cors
}
