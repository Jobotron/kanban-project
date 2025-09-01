# base image
FROM golang:1.24 AS builder
# Set working directory
WORKDIR /app
# Copy Go modules and dependencies
COPY ./kanban/* ./
RUN go mod download
# Copy source code
COPY . .
# Build the application
RUN go build -o main .
# Use a minimal base image for final deployment
FROM alpine:latest
# Set working directory in the container
WORKDIR /root/
# Copy the built binary from the builder stage
COPY --from=builder /app/main .
# Expose the application port
EXPOSE 8080
# Run the application
CMD ["./main"]

