package entity

import (
	"encoding/json"
)

type Settings struct {
	SoundOn bool `json:"soundOn"`
}

func NewDefaultSettingsEntity() *Settings {
	return &Settings{
		SoundOn: true,
	}
}

func (s *Settings) MarshalBinary() ([]byte, error) {
	return json.Marshal(s)
}

func (s *Settings) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, s)
}
