FROM golang:1.24 AS builder

WORKDIR /app

COPY kanban/go.mod kanban/go.sum ./

RUN go mod download

# Install build dependencies for CGO and SQLite
RUN apt-get update && apt-get install -y gcc

COPY . .
# Build the server binary
WORKDIR /app/kanban/cmd/server
RUN echo "Listing files in /app/kanban/cmd/server:" && ls
RUN mkdir -p 'app/bin'

RUN CGO_ENABLED=1 GOOS=linux go build -o /app/bin/kanban-server -a -ldflags '-linkmode external -extldflags "-static"' .
RUN echo "Build completed. Listing files in /app/bin:" && ls app/bin

# runtime image

FROM alpine:latest as runtime
# Set working directory in the container
RUN adduser -D -h /app appuser
WORKDIR /app
# Copy the built binary from the builder stage
COPY --from=builder /app/bin/kanban-server ./bin/kanban-server
# Expose the application port
USER appuser
EXPOSE 8080
# Run the application
CMD ["bin/kanban-server"]

