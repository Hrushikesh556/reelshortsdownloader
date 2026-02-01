# Multi-stage build for Reel Downloader

# Stage 1: Build React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-slim AS production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && pip3 install yt-dlp --break-system-packages \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/index.js ./

# Create public directory and copy built frontend
RUN mkdir -p public/videos
COPY --from=frontend-builder /app/dist ./public/

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "index.js"]
