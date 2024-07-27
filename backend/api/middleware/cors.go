package middleware

import (
	"main/utils"
	"net/http"

	"github.com/rs/cors"
)

func SetupCors() *cors.Cors {
	browserOrigin := utils.GetEnvironmentVariable("BROWSER_ORIGIN")
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{browserOrigin},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodPut, http.MethodOptions},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	return cors
}
