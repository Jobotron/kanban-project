.PHONY: help setup dev frontend backend lint build clean clean-build clean-node clean-docker clean-all docker-build docker-run

help:
	@echo "Kanban Project - Available Commands"
	@echo "===================================="
	@echo "setup              Install dependencies (frontend npm + backend go)"
	@echo "dev                Run frontend and backend concurrently"
	@echo "frontend           Run frontend development server only"
	@echo "backend            Run backend server only"
	@echo "build              Build production artifacts (frontend dist + backend binary)"
	@echo "lint               Run linters (frontend eslint)"
	@echo "clean              Remove build artifacts (alias for clean-build)"
	@echo "clean-build        Remove build artifacts only"
	@echo "clean-node         Remove node_modules and npm cache"
	@echo "clean-docker       Remove Docker images and containers"
	@echo "clean-all          Full cleanup (artifacts, node_modules, docker, caches)"
	@echo "docker-build       Build Docker image for backend"
	@echo "docker-run         Run Docker container locally"

# Setup: Install all dependencies
setup:
	@echo "📦 Setting up project..."
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Downloading backend dependencies..."
	cd backend && go mod download
	@echo "✅ Setup complete!"

# Development: Run both frontend and backend
dev:
	@echo "🚀 Starting development environment..."
	concurrently \
		--names "frontend,backend" \
		--prefix "[{name}]" \
		"make frontend-dev" \
		"make backend-dev"

frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && go run ./kanban/cmd/server

# Individual servers
frontend:
	cd frontend && npm run dev

backend:
	cd backend && go run ./kanban/cmd/server

# Linting
lint:
	@echo "🔍 Running linters..."
	cd frontend && npm run lint

# Build production artifacts
build:
	@echo "🔨 Building for production..."
	@echo "Building frontend..."
	cd frontend && npm run build
	@echo "Building backend..."
	cd backend && CGO_ENABLED=1 go build -o ./bin/kanban-server ./kanban/cmd/server
	@echo "✅ Build complete!"

# Clean artifacts
clean: clean-build

clean-build:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf frontend/dist
	rm -rf backend/bin
	go clean -cache -testcache -modcache
	@echo "✅ Build artifacts cleaned!"

clean-node:
	@echo "🧹 Cleaning node_modules and npm cache..."
	rm -rf frontend/node_modules
	rm -rf frontend/package-lock.json
	npm cache clean --force
	@echo "✅ Node modules cleaned!"

clean-docker:
	@echo "🧹 Cleaning Docker images and containers..."
	@if [ "$$(docker images -q kanban-server 2>/dev/null)" ]; then \
		docker rmi -f kanban-server:latest; \
		echo "Removed kanban-server:latest image"; \
	fi
	@if [ "$$(docker ps -aq -f ancestor=kanban-server:latest 2>/dev/null)" ]; then \
		docker rm -f $$(docker ps -aq -f ancestor=kanban-server:latest); \
		echo "Removed kanban-server containers"; \
	fi
	@echo "✅ Docker cleaned!"

clean-all: clean-build clean-node clean-docker
	@echo "🧹 Full cleanup complete!"
	@echo "To restore: run 'make setup' to reinstall everything"

# Docker commands
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -f backend/Dockerfile -t kanban-server:latest .
	@echo "✅ Docker image built!"

docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 8080:8080 kanban-server:latest
	@echo "Container stopped."
