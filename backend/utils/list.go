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
