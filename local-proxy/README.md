# Local Proxy Server

This is used only in local development in emulate what Firebase Hosting provides in production using rewrites (see ./firebase/firebase.json). In production, requests are routed by Firebase Hosting to different services based on the requested URL path. For example, requests made to the `/api/core` path will get routed to the `core` service.

### Complete List of Routing

- `/` --> frontend service
- `/api/core` --> core service
- `/api/play` --> play service
