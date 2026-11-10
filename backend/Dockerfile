FROM golang:1.24 AS builder

WORKDIR /app

# Copy Go module files
COPY backend/kanban/go.mod backend/kanban/go.sum ./

RUN go mod download

# Install build dependencies for CGO and SQLite
RUN apt-get update && apt-get install -y gcc

# Copy entire backend source
COPY backend/kanban ./

# Build the server binary
RUN CGO_ENABLED=1 GOOS=linux go build -o /app/bin/kanban-server -a -ldflags '-linkmode external -extldflags "-static"' ./cmd/server

# runtime image
FROM alpine:latest as runtime

# Set working directory in the container
RUN adduser -D -h /app appuser
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/bin/kanban-server ./bin/kanban-server
RUN chown -R appuser:appuser /app \
    && chmod +x ./bin/kanban-server

# Expose the application port
USER appuser
EXPOSE 8080

# Run the application
CMD ["bin/kanban-server"]

