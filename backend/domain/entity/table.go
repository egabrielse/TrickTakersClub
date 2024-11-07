package entity

import (
	"encoding/json"

	"github.com/google/uuid"
)

type TableEntity struct {
	ID        string          `json:"id"`
	CreatorID string          `json:"creatorId"`
	Users     map[string]bool `json:"users"`
}

func NewTableEntity(creatorId string) *TableEntity {
	return &TableEntity{
		ID:        uuid.New().String(),
		CreatorID: creatorId,
		Users:     make(map[string]bool),
	}
}

func (t *TableEntity) MarshalBinary() ([]byte, error) {
	return json.Marshal(t)
}

func (t *TableEntity) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, t)
}
