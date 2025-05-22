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
	// -> Connect route
	router.GET("/api/play/v1/connect/:sessionId", request.HandleWith(
		handlers.Connect,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// -> Game routes
	router.POST("/api/play/v1/create", request.HandleWith(
		handlers.NewGame,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))
	router.POST("/api/play/v1/revive/:sessionId", request.HandleWith(
		handlers.ReviveGame,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// 3. Add CORS middleware
	allowedOrigin := env.GetEnvironmentVariable("ALLOWED_ORIGIN")
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{allowedOrigin},
		AllowedMethods: []string{http.MethodPost, http.MethodGet},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	routerWithCORS := cors.Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
