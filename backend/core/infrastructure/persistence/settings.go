package persistence

import (
	"context"
	"main/domain/entity"

	"cloud.google.com/go/firestore"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const SettingsCollection = "settings"

type SettingsRepoImplementation struct {
	db *firestore.Client
}

func NewSettingsRepoImplementation(db *firestore.Client) *SettingsRepoImplementation {
	return &SettingsRepoImplementation{db: db}
}

// Get returns the Settings entity from the firestore db
func (r *SettingsRepoImplementation) Get(ctx context.Context, UID string) (*entity.Settings, error) {
	// Saved settings may not include newly added fields,so we start with the default settings and map the saved settings on top of it.
	entity := entity.NewDefaultSettingsEntity()
	if snapshot, err := r.db.Collection(SettingsCollection).Doc(UID).Get(ctx); err != nil {
		if status.Code(err) == codes.NotFound {
			// If the document does not exist, return the default settings
			return entity, nil
		}
		return nil, err
	} else if err := snapshot.DataTo(&entity); err != nil {
		return nil, err
	} else {
		return entity, nil
	}
}

// Save saves the Settings entity to the firestore db
func (r *SettingsRepoImplementation) Save(ctx context.Context, UID string, entity *entity.Settings) error {
	if _, err := r.db.Collection(SettingsCollection).Doc(UID).Set(ctx, entity); err != nil {
		logrus.Error(err)
		return err
	}
	return nil
}
