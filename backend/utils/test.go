package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func AssertZeroSum(t *testing.T, expected []int, actual []int) {
	sumExpected := SumValues(expected)
	sumActual := SumValues(actual)
	assert.Equal(t, sumExpected, sumActual)
}
