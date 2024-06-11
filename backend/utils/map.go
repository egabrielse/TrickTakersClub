package utils

func MapKeys[K comparable, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}

func MapValues[K comparable, V any](m map[K]V) []V {
	values := make([]V, 0, len(m))
	for _, v := range m {
		values = append(values, v)
	}
	return values
}

type MapEntry[K comparable, V any] struct {
	Key   K
	Value V
}

func MapEntries[K comparable, V any](m map[K]V) []MapEntry[K, V] {
	entries := make([]MapEntry[K, V], 0, len(m))
	for k, v := range m {
		entries = append(entries, MapEntry[K, V]{k, v})
	}
	return entries
}
