package session

import "time"

const (
	defaultTimeout            = 3 * time.Minute
	defaultGameExpiration     = 30 * time.Minute
	defaultSessionExpiration  = 30 * time.Second
	defaultPresenceExpiration = 12 * time.Second
)
