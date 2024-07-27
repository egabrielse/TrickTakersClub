package utils

import (
	"github.com/sirupsen/logrus"
)

// InitLogger initializes the global logger
func ConfigureLogrus() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
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
