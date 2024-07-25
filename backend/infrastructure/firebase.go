package infrastructure

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
)

var firebaseApp *firebase.App

// InitFirebaseApp initializes the Firebase app
func InitFirebaseApp() {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	config := &firebase.Config{ProjectID: projectID}
	if app, err := firebase.NewApp(context.Background(), config); err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	} else {
		firebaseApp = app
	}
}

// GetFirebaseAuth returns the Firebase auth client
func GetFirebaseAuth(ctx context.Context) (*auth.Client, error) {
	if auth, err := firebaseApp.Auth(ctx); err != nil {
		return nil, err
	} else {
		return auth, nil
	}
}
