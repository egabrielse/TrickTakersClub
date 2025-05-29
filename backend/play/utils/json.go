package utils

import "encoding/json"

// UnmarshalTo unmarshals a JSON string into a struct of type T.
func UnmarshalTo[T any](data interface{}) (*T, error) {
	params := new(T)
	if err := json.Unmarshal([]byte(data.(string)), params); err != nil {
		return nil, err
	}
	return params, nil
}
