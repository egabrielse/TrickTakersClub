package api

import (
	"main/api/handlers"
	"main/api/middleware"
	"main/api/middleware/decorators"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func InitRouter() *http.Handler {
	// 1. Define router
	router := httprouter.New()

	// 2. Define routes and their handlers
	// - Index routes
	router.GET("/v1", middleware.HandleWith(handlers.HealthCheck, decorators.RequestLogging))

	// // - User routes TODO: Remove user handling code
	// router.POST("/v1/user", middleware.HandleWith(handlers.CreateUser, decorators.RequestLogging))
	// router.GET("/v1/user/:id", middleware.HandleWith(handlers.GetUser, decorators.RequestLogging))
	// router.GET("/v1/users", middleware.HandleWith(handlers.GetAllUsers, decorators.RequestLogging))

	// 3. Add CORS middleware
	cors := middleware.SetupCors()
	routerWithCORS := cors.Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
