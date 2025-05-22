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
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodPut, http.MethodOptions},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	return cors
}
