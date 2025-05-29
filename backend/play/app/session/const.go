package session

import "time"

const DefaultTimeout = 5 * time.Minute

const DefaultGameExpiration = 6 * time.Hour

const DefaultSessionExpiration = 30 * time.Second

const DefaultPresenceExpiration = 15 * time.Second

const TickerDuration = 10 * time.Second

const SessionWorkerChannelSize = 50
