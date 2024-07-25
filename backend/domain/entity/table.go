package entity

import (
	"encoding/json"

	"github.com/google/uuid"
)

type TableEntity struct {
	ID     string          `json:"id"`
	HostID string          `json:"hostId"`
	Users  map[string]bool `json:"users"`
}

func NewTableEntity(hostId string) *TableEntity {
	return &TableEntity{
		ID:     uuid.New().String(),
		HostID: hostId,
		Users:  make(map[string]bool),
	}
}

func (t *TableEntity) MarshalBinary() ([]byte, error) {
	return json.Marshal(t)
}

func (t *TableEntity) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, t)
}
