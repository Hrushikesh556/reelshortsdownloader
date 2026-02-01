# Multi-stage build for Reel Downloader

# ============================================
# Stage 1: Build React Frontend
# ============================================
FROM node:20-slim AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# ============================================
# Stage 2: Production Server
# ============================================
FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create Python virtual environment and install yt-dlp
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip && pip install yt-dlp

# Verify yt-dlp installation
RUN yt-dlp --version

WORKDIR /app

# Copy server package.json
COPY server/package.json ./

# Install server dependencies
RUN npm install --omit=dev

# Copy server code
COPY server/index.js ./

# Create directories
RUN mkdir -p public/videos

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./public/

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "index.js"]
