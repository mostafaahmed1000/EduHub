# Use the official Node.js image as a base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --force

# Copy source files
COPY . .

# Build the application
RUN npm run build --force

# Use a smaller image for production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]