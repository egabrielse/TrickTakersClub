package entity

import (
	"encoding/json"

	"github.com/google/uuid"
)

type TableEntity struct {
	ID        string          `json:"id"`
	CreatorID string          `json:"creatorID"`
	Users     map[string]bool `json:"users"`
}

func NewTableEntity(creatorID string) *TableEntity {
	return &TableEntity{
		ID:        uuid.New().String(),
		CreatorID: creatorID,
		Users:     make(map[string]bool),
	}
}

func (t *TableEntity) MarshalBinary() ([]byte, error) {
	return json.Marshal(t)
}

func (t *TableEntity) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, t)
}
