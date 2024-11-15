package utils

import (
	"fmt"
	"runtime"

	"github.com/sirupsen/logrus"
)

// InitLogger initializes the global logger
func ConfigureLogrus() {
	logrus.SetFormatter(&logrus.TextFormatter{
		ForceColors: true,
		CallerPrettyfier: func(f *runtime.Frame) (string, string) {
			return "", fmt.Sprintf("%s:%d", f.File, f.Line)
		},
	})
	logrus.SetReportCaller(true)
}

// LogOnError logs the error if it is not nil
func LogOnError(err error) (isError bool) {
	if err != nil {
		logrus.Error(err)
		return true
	}
	return false
}
