package session

import "time"

const (
	defaultTimeout            = 3 * time.Minute
	defaultGameExpiration     = 30 * time.Minute
	defaultSessionExpiration  = 10 * time.Minute
	defaultPresenceExpiration = 12 * time.Second
)
