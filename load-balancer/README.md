# Local Load Balancer

This is used only in local development to emulate what the Google Cloud Application Load Balancer does in production using. In production, the load balancer acts as the main entry point for the application. Requests are routed by the load balancer to different services based on the requested URL path. For example, requests made to the `/api/core` path will get routed to the `core` service.

### Complete List of Routing

- `/*` --> frontend service
- `/api/core/*` --> core service
- `/api/play/*` --> play service
