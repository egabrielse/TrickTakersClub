package session

import "time"

const (
	defaultTimeout            = 3 * time.Minute
	defaultGameExpiration     = 6 * time.Hour
	defaultSessionExpiration  = 30 * time.Second
	defaultPresenceExpiration = 15 * time.Second
)
