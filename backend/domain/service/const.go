package service

import "time"

// TickerDuration is the duration after which the service will check for activity
const TickerDuration = time.Second * 30

// TimeoutDuration is the duration after which the service will be stopped if no activity is detected
const TimeoutDuration = time.Minute * 10
