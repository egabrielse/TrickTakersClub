# Build Stage
FROM golang:1.20

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire application
COPY . .

# Build the application binary
RUN go build -o /binary

EXPOSE 8080

CMD [ "/binary" ]