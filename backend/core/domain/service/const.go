package service

import "time"

// TickerDuration is the duration after which the service will check for activity
const TickerDuration = time.Second * 30

// DefaultTimeoutDuration is the default duration after which the server worker will stop if no activity is detected
const DefaultTimeoutDuration = time.Minute * 10
