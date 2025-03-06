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
	// -> Ably routes
	router.GET("/v1/ably/token", middleware.HandleWith(handlers.AblyAuth, decorators.RequestLogging, decorators.TokenAuthentication))

	// -> Index routes
	router.GET("/v1", middleware.HandleWith(handlers.HealthCheck, decorators.RequestLogging))

	// -> Table routes
	router.POST("/v1/table", middleware.HandleWith(handlers.CreateTable, decorators.RequestLogging, decorators.TokenAuthentication))
	router.GET("/v1/table/:id", middleware.HandleWith(handlers.GetTable, decorators.RequestLogging, decorators.TokenAuthentication))
	router.DELETE("/v1/table/:id", middleware.HandleWith(handlers.DeleteTable, decorators.RequestLogging, decorators.TokenAuthentication))

	// -> User routes
	router.GET("/v1/user/:id", middleware.HandleWith(handlers.GetUserByID, decorators.RequestLogging, decorators.TokenAuthentication))

	// -> User settings routes
	router.PUT("/v1/user_settings", middleware.HandleWith(handlers.SaveUserSettings, decorators.RequestLogging, decorators.TokenAuthentication))
	router.GET("/v1/user_settings", middleware.HandleWith(handlers.GetUserSettings, decorators.RequestLogging, decorators.TokenAuthentication))

	// 3. Add CORS middleware
	routerWithCORS := middleware.SetupCors().Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
