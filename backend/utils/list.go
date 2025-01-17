package utils

func AlphabetizeList(list []string) []string {
	for i := 0; i < len(list); i++ {
		for j := i + 1; j < len(list); j++ {
			if list[i] > list[j] {
				list[i], list[j] = list[j], list[i]
			}
		}
	}
	return list
}

// RelistStartingWith returns a new list with the same elements as the input list, but starting with the element that matches the start value.
func RelistStartingWith[T comparable](list []T, start T) []T {
	newList := make([]T, len(list))
	copy(newList, list)
	for i, v := range newList {
		if v == start {
			return append(newList[i:], newList[:i]...)
		}
	}
	return list
}

func Contains[T comparable](list []T, item T) bool {
	for _, v := range list {
		if v == item {
			return true
		}
	}
	return false
}

func SumValues(m []int) (sum int) {
	for _, v := range m {
		sum += v
	}
	return sum
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
