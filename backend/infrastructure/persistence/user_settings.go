package persistence

import (
	"context"
	"main/domain/entity"

	"cloud.google.com/go/firestore"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const UserSettingsCollection = "user_settings"

type UserSettingsRepoImplementation struct {
	db *firestore.Client
}

func NewUserSettingsRepoImplementation(db *firestore.Client) *UserSettingsRepoImplementation {
	return &UserSettingsRepoImplementation{db: db}
}

// Get returns the UserSettings entity from the firestore db
func (r *UserSettingsRepoImplementation) Get(ctx context.Context, UID string) (*entity.UserSettings, error) {
	// Saved settings may not include newly added fields,so we start with the default settings and map the saved settings on top of it.
	entity := entity.NewDefaultUserSettingsEntity()
	if snapshot, err := r.db.Collection(UserSettingsCollection).Doc(UID).Get(ctx); err != nil {
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

// Save saves the UserSettings entity to the firestore db
func (r *UserSettingsRepoImplementation) Save(ctx context.Context, UID string, entity *entity.UserSettings) error {
	if _, err := r.db.Collection(UserSettingsCollection).Doc(UID).Set(ctx, entity); err != nil {
		logrus.Error(err)
		return err
	}
	return nil
}
