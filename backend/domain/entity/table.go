package entity

import (
	"encoding/json"

	"github.com/sio/coolname"
)

type TableEntity struct {
	ID     string `json:"id"`
	HostID string `json:"hostId"`
}

func NewTableEntity(hostId string) (*TableEntity, error) {
	if id, err := coolname.SlugN(3); err != nil {
		return nil, err
	} else {
		return &TableEntity{
			ID:     id,
			HostID: hostId,
		}, nil
	}
}

func (t *TableEntity) MarshalBinary() ([]byte, error) {
	return json.Marshal(t)
}

func (t *TableEntity) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, t)
}
