package persistence

import (
	"context"
	"main/domain/entity"

	"cloud.google.com/go/firestore"
	"github.com/sirupsen/logrus"
)

const TableCollection = "tables"

type TableRepoImplementation struct {
	db *firestore.Client
}

func NewTableRepoImplementation(db *firestore.Client) *TableRepoImplementation {
	return &TableRepoImplementation{db: db}
}

// Get returns the Table entity from the firestore db
func (r *TableRepoImplementation) Get(ctx context.Context, ID string) (*entity.TableEntity, error) {
	var table entity.TableEntity
	if snapshot, err := r.db.Collection(TableCollection).Doc(ID).Get(ctx); err != nil {
		return nil, err
	} else if err := snapshot.DataTo(&table); err != nil {
		return nil, err
	} else {
		return &table, nil
	}
}

// Delete deletes the Table entity from the firestore db
func (r *TableRepoImplementation) Delete(ctx context.Context, ID string) error {
	if _, err := r.db.Collection(TableCollection).Doc(ID).Delete(ctx); err != nil {
		logrus.Error(err)
		return err
	}
	return nil
}

// Save saves the Table entity to the firestore db
func (r *TableRepoImplementation) Save(ctx context.Context, table *entity.TableEntity) error {
	if _, err := r.db.Collection(TableCollection).Doc(table.ID).Set(ctx, table); err != nil {
		logrus.Error(err)
		return err
	}
	return nil
}
