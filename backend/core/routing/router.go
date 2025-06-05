package routing

import (
	"common/env"
	"common/request"
	"common/request/decorators"
	"main/routing/handlers"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

func InitRouter() *http.Handler {
	// 1. Define router
	router := httprouter.New()

	// 2. Define routes and their handlers
	// -> Ably routes
	router.GET("/api/core/v1/ably/token", request.HandleWith(
		handlers.AblyAuth,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// -> Index routes
	router.GET("/api/core/v1", request.HandleWith(
		handlers.HealthCheck,
		decorators.RequestLogging,
	))

	// -> Game routes
	router.GET("/api/core/v1/game", request.HandleWith(
		handlers.FetchSavedGameList,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// -> Session routes
	router.GET("/api/core/v1/session", request.HandleWith(
		handlers.FetchSessionList,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// -> Table routes
	router.POST("/api/core/v1/table", request.HandleWith(
		handlers.CreateTable,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))
	router.GET("/api/core/v1/table/:id", request.HandleWith(
		handlers.GetTable,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))
	router.DELETE("/api/core/v1/table/:id", request.HandleWith(
		handlers.DeleteTable,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// -> User routes
	router.GET("/api/core/v1/user/:id", request.HandleWith(
		handlers.GetUserByID,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// -> User settings routes
	router.PUT("/api/core/v1/settings", request.HandleWith(
		handlers.SaveSettings,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))
	router.GET("/api/core/v1/settings", request.HandleWith(
		handlers.GetSettings,
		decorators.RequestLogging,
		decorators.TokenAuthentication,
	))

	// 3. Add CORS request
	allowedOrigin := env.GetEnvVar("ALLOWED_ORIGIN")
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{allowedOrigin},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodPut, http.MethodOptions},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	routerWithCORS := cors.Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
