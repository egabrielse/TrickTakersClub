package utils

import (
	"encoding/json"
	"errors"
)

// UnmarshalTo decodes a JSON value (string or json.RawMessage) into a struct of type T.
func UnmarshalTo[T any](data any) (*T, error) {
	var bytes []byte
	switch v := data.(type) {
	case string:
		bytes = []byte(v)
	case json.RawMessage:
		bytes = v
	default:
		return nil, errors.New("data must be a string or json.RawMessage")
	}
	params := new(T)
	if err := json.Unmarshal(bytes, params); err != nil {
		return nil, err
	}
	return params, nil
}
