package routing

import (
	"net/http"
	"play/routing/handlers"
	"play/routing/middleware"
	"play/routing/middleware/decorators"

	"github.com/julienschmidt/httprouter"
)

func InitRouter() *http.Handler {
	// 1. Define router
	router := httprouter.New()

	// 2. Define routes and their handlers
	// -> Connect route
	router.GET("/play/v1/connect/:sessionId", handlers.Connect)

	// -> Game routes
	router.POST("/play/v1/create", middleware.HandleWith(handlers.NewGame, decorators.RequestLogging, decorators.TokenAuthentication))
	router.POST("/play/v1/revive/:sessionId", middleware.HandleWith(handlers.ReviveGame, decorators.RequestLogging, decorators.TokenAuthentication))

	// 3. Add CORS middleware
	routerWithCORS := middleware.SetupCors().Handler(router)

	// 4. Return initialized router
	return &routerWithCORS
}
