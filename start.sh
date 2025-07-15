#!/bin/sh

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
until curl -s http://web:8000/ > /dev/null; do
  echo "Backend not ready yet, retrying in 3 seconds..."
  sleep 3
done
echo "Backend is ready, starting frontend..."

# Build and start the application
npm run build && npm start
