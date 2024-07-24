package firebase

import (
	"context"
	"log"
	"os"

	fb "firebase.google.com/go/v4"
)

var firebaseApp *fb.App

// InitFirebaseApp initializes the Firebase app
func InitFirebaseApp() {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	config := &fb.Config{ProjectID: projectID}
	if app, err := fb.NewApp(context.Background(), config); err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	} else {
		firebaseApp = app
	}
}

// GetFirebaseApp returns the Firebase app
func GetFirebaseApp() *fb.App {
	return firebaseApp
}
