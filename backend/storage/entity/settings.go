package entity

import (
	"encoding/json"
)

type Settings struct {
	SoundOn  bool `json:"soundOn"`
	ChatOpen bool `json:"chatOpen"`
}

func NewDefaultSettingsEntity() *Settings {
	return &Settings{
		SoundOn:  true,
		ChatOpen: true,
	}
}

func (s *Settings) MarshalBinary() ([]byte, error) {
	return json.Marshal(s)
}

func (s *Settings) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, s)
}
