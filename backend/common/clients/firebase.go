package clients

import (
	"context"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/sirupsen/logrus"
)

var firebaseAuth *auth.Client
var firebaseStore *firestore.Client

// InitFirebaseApp initializes the Firebase app
func InitFirebaseClients(projectID string) {
	config := &firebase.Config{ProjectID: projectID}
	app, err := firebase.NewApp(context.Background(), config)
	if err != nil {
		logrus.Fatal("Error Initializing Firebase: ", err)
		return
	}
	// Initialize Firebase auth client
	if auth, err := app.Auth(context.Background()); err != nil {
		logrus.Fatal("Error Connecting to Firebase Auth: ", err)
	} else {
		firebaseAuth = auth
	}

	// Initialize Firestore client
	if store, err := app.Firestore(context.Background()); err != nil {
		logrus.Fatal("Error Connecting to Firestore: ", err)
	} else {
		firebaseStore = store
	}
}

// GetFirebaseAuth returns the Firebase auth client
func GetFirebaseAuthClient() *auth.Client {
	return firebaseAuth
}

func GetFirebaseStoreClient() *firestore.Client {
	return firebaseStore
}
