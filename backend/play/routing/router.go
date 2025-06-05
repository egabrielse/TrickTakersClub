package routing

import (
	"common/env"
	"common/request"
	"common/request/decorators"
	"net/http"
	"play/routing/handlers"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

func InitRouter() *http.Handler {
	// 1. Define router
	router := httprouter.New()

	// 2. Define routes and their handlers
	router.GET("/api/play/v1/connect/:sessionId", request.HandleWith(
		handlers.Connect,
		decorators.RequestLogging,
		decorators.ParamAuthentication,
	))

	router.POST("/api/play/v1/session", request.HandleWith(
		handlers.NewGameSession,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	router.POST("/api/play/v1/session/:gameId", request.HandleWith(
		handlers.ReviveGame,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// 3. Add CORS middleware
	allowedOrigin := env.GetEnvVar("ALLOWED_ORIGIN")
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{allowedOrigin},
		AllowedMethods: []string{http.MethodPost, http.MethodGet},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	routerWithCORS := cors.Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
