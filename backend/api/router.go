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
	// index routes
	router.GET("/", middleware.HandleWith(handlers.HealthCheck, decorators.RequestLogging))

	// 3. Add CORS middleware
	routerWithCORS := cors.Default().Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
