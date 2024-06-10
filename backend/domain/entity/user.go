package entity

import (
	"encoding/json"

	"github.com/google/uuid"
)

type UserEntity struct {
	ID       string `json:"id"`       // Unique ID
	Username string `json:"username"` // User facing name
	Email    string `json:"email"`    // User's email
}

func NewUserEntity(username string, email string) *UserEntity {
	return &UserEntity{
		ID:       uuid.New().String(),
		Username: username,
		Email:    email,
	}
}

func (u *UserEntity) MarshalBinary() ([]byte, error) {
	return json.Marshal(u)
}

func (u *UserEntity) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, u)
}
