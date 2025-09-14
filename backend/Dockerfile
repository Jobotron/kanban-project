FROM golang:1.24 AS builder

WORKDIR /app

COPY kanban/go.mod kanban/go.sum ./

RUN go mod download

COPY . .
# Build the server binary
WORKDIR /app/cmd/server
RUN echo "Listing files in /app/cmd/server:" && ls
RUN go build -o app/bin/kanban-server
# runtime image

FROM alpine:latest as runtime
# Set working directory in the container
RUN useradd -m appuser
WORKDIR /app
# Copy the built binary from the builder stage
COPY --from=builder /app/bin/kanban-server .
# Expose the application port
USER appuser
EXPOSE 8080
# Run the application
CMD ["./kanban-server"]

