package session

import "time"

// Must be less than the default session expiration time
const tickerDuration = 5 * time.Second
