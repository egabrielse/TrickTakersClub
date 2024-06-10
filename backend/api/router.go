package api

import (
	"main/api/handlers"
	"main/api/middleware"
	"main/api/middleware/decorators"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

func InitRouter() *http.Handler {
	// 1. Define router
	router := httprouter.New()

	// 2. Define routes and their handlers
	// - Index routes
	router.GET("/", middleware.HandleWith(handlers.HealthCheck, decorators.RequestLogging))

	// - User routes
	router.POST("/v1/user", middleware.HandleWith(handlers.CreateUser, decorators.RequestLogging))
	router.GET("/v1/user/:id", middleware.HandleWith(handlers.GetUser, decorators.RequestLogging))
	router.GET("/v1/users", middleware.HandleWith(handlers.GetAllUsers, decorators.RequestLogging))

	// 3. Add CORS middleware
	routerWithCORS := cors.Default().Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
