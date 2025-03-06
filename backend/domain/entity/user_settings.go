package entity

import (
	"encoding/json"
)

type UserSettings struct {
	SoundOn bool `json:"soundOn"`
}

func NewDefaultUserSettingsEntity() *UserSettings {
	return &UserSettings{
		SoundOn: true,
	}
}

func (us *UserSettings) MarshalBinary() ([]byte, error) {
	return json.Marshal(us)
}

func (us *UserSettings) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, us)
}
