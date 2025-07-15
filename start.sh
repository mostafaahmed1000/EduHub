#!/bin/sh

# Enhanced health check with timeout
wait_for_backend() {
  echo "Waiting for backend at web:8000..."
  for i in {1..10}; do
    if curl -sSf http://web:8000/health-check >/dev/null; then
      echo "Backend ready!"
      return 0
    fi
    echo "Attempt $i/10 - Backend not ready, retrying in 3s..."
    sleep 3
  done
  echo "Backend connection failed after 30s!"
  exit 1
}

wait_for_backend

# Build and start frontend
npm run build
npm start