package utils

func Contains[T comparable](list []T, item T) bool {
	for _, v := range list {
		if v == item {
			return true
		}
	}
	return false
}

func Filter[T any](list []T, filter func(T) bool) []T {
	var filtered []T
	for _, v := range list {
		if filter(v) {
			filtered = append(filtered, v)
		}
	}
	return filtered
}
