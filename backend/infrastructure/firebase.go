package infrastructure

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
)

var firebaseAuth *auth.Client
var firebaseStore *firestore.Client

// InitFirebaseApp initializes the Firebase app
func InitFirebaseApp() {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	config := &firebase.Config{ProjectID: projectID}
	app, err := firebase.NewApp(context.Background(), config)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
		return
	}
	// Initialize Firebase auth client
	if auth, err := app.Auth(context.Background()); err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	} else {
		firebaseAuth = auth
	}

	// Initialize Firestore client
	if store, err := app.Firestore(context.Background()); err != nil {
		log.Fatalf("error getting Firestore client: %v\n", err)
	} else {
		firebaseStore = store
	}
}

// GetFirebaseAuth returns the Firebase auth client
func GetFirebaseAuth() *auth.Client {
	return firebaseAuth
}

func GetFirebaseStore() *firestore.Client {
	return firebaseStore
}
