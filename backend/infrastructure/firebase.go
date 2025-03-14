package infrastructure

import (
	"context"
	"main/utils"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/sirupsen/logrus"
)

var firebaseAuth *auth.Client
var firebaseStore *firestore.Client

// InitFirebaseApp initializes the Firebase app
func InitFirebaseApp() {
	projectID := utils.GetEnvironmentVariable("FIREBASE_PROJECT_ID")
	logrus.Debug("Initializing Firebase App")
	logrus.Debug(projectID)
	config := &firebase.Config{ProjectID: projectID}
	app, err := firebase.NewApp(context.Background(), config)
	if err != nil {
		logrus.Fatal("Error Initializing Firebase: ", err)
		return
	}
	// Initialize Firebase auth client
	if auth, err := app.Auth(context.Background()); err != nil {
		logrus.Fatal("Error Fetching Auth Client: ", err)
	} else {
		firebaseAuth = auth
	}

	// Initialize Firestore client
	if store, err := app.Firestore(context.Background()); err != nil {
		logrus.Fatal("Error Fetching Firestore Client: ", err)
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
