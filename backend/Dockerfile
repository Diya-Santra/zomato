# Stage 1: Build
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for potential builds)
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Production
FROM node:20-alpine AS production

# Set environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built/source files from build stage
COPY --from=build /app/src ./src
COPY --from=build /app/server.js ./server.js

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
