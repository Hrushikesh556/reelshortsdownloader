# Backend Setup Guide

This frontend requires a backend server running yt-dlp to download videos.

## Prerequisites

Install on your VPS/server:

```bash
sudo apt update
sudo apt install ffmpeg python3-pip -y
pip install yt-dlp
```

## Backend Code (server/index.js)

Create a `server` folder and add `index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve downloaded videos
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Ensure videos directory exists
const videosDir = path.join(__dirname, 'public/videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Download endpoint
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL patterns
  const validPatterns = [
    /instagram\.com\/(reel|p)\//i,
    /facebook\.com.*\/reel/i,
    /fb\.watch/i,
    /youtube\.com\/shorts\//i,
    /youtu\.be\//i,
  ];

  const isValidUrl = validPatterns.some(pattern => pattern.test(url));
  
  if (!isValidUrl) {
    return res.status(400).json({ 
      error: 'Invalid URL. Please provide an Instagram Reel, Facebook Reel, or YouTube Shorts URL.' 
    });
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const outputTemplate = path.join(videosDir, `video_${timestamp}.%(ext)s`);
    
    // yt-dlp command
    const command = `yt-dlp -f "best[ext=mp4]/best" --merge-output-format mp4 -o "${outputTemplate}" "${url}"`;

    exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        console.error('yt-dlp error:', stderr);
        return res.status(500).json({ 
          error: 'Failed to download video. Please check the URL and try again.' 
        });
      }

      // Find the downloaded file
      const files = fs.readdirSync(videosDir);
      const downloadedFile = files.find(f => f.startsWith(`video_${timestamp}`));

      if (!downloadedFile) {
        return res.status(500).json({ error: 'Download completed but file not found.' });
      }

      // Get video title from yt-dlp output
      let title = downloadedFile;
      const titleMatch = stdout.match(/\[download\] Destination: (.+)/);
      if (titleMatch) {
        title = path.basename(titleMatch[1]);
      }

      res.json({
        file: `/videos/${downloadedFile}`,
        title: title
      });

      // Optional: Clean up old files (keep last 100)
      cleanupOldFiles(videosDir, 100);
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cleanup function
function cleanupOldFiles(directory, keepCount) {
  try {
    const files = fs.readdirSync(directory)
      .map(file => ({
        name: file,
        path: path.join(directory, file),
        time: fs.statSync(path.join(directory, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > keepCount) {
      files.slice(keepCount).forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Videos directory: ${videosDir}`);
});
```

## package.json for server

```json
{
  "name": "video-downloader-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Installation

```bash
cd server
npm install
npm run dev
```

## Production with PM2

```bash
npm install -g pm2
pm2 start index.js --name "video-downloader"
pm2 save
pm2 startup
```

## NGINX Reverse Proxy (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /videos {
        proxy_pass http://localhost:5000;
    }

    location / {
        root /var/www/video-downloader;
        try_files $uri $uri/ /index.html;
    }
}
```

## Test URLs

- Instagram: `https://www.instagram.com/reel/ABC123/`
- Facebook: `https://www.facebook.com/reel/123456789`
- YouTube Shorts: `https://www.youtube.com/shorts/ABC123`
