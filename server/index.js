const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Serve static files (React build + videos)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Ensure videos directory exists
const videosDir = path.join(__dirname, 'public/videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Download endpoint
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    const validDomains = [
        'instagram.com', 
        'facebook.com', 
        'fb.watch', 
        'fb.com',
        'youtube.com', 
        'youtu.be',
        'tiktok.com'
    ];
    
    const isValid = validDomains.some(domain => url.includes(domain));
    
    if (!isValid) {
        return res.status(400).json({ 
            error: 'Invalid URL. Supported platforms: Instagram, Facebook, YouTube, TikTok' 
        });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const outputTemplate = path.join(videosDir, `video_${timestamp}_${randomId}.%(ext)s`);

    // yt-dlp command with best quality MP4
    const command = `yt-dlp \
        -f "best[ext=mp4]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best" \
        --merge-output-format mp4 \
        --no-playlist \
        --no-warnings \
        -o "${outputTemplate}" \
        "${url}"`;

    console.log(`📥 Downloading: ${url}`);

    exec(command, { timeout: 180000 }, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Download error:', error.message);
            console.error('stderr:', stderr);
            
            // Check for common errors
            if (stderr.includes('Private video') || stderr.includes('login required')) {
                return res.status(400).json({ 
                    error: 'This video is private or requires login.' 
                });
            }
            
            if (stderr.includes('Video unavailable')) {
                return res.status(400).json({ 
                    error: 'Video not found or has been deleted.' 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to download video. Please check the URL and try again.' 
            });
        }

        // Find the downloaded file
        const files = fs.readdirSync(videosDir);
        const downloadedFile = files.find(f => f.includes(`video_${timestamp}_${randomId}`));

        if (downloadedFile) {
            const filePath = path.join(videosDir, downloadedFile);
            const stats = fs.statSync(filePath);
            
            console.log(`✅ Downloaded: ${downloadedFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

            res.json({ 
                success: true,
                file: `/videos/${downloadedFile}`,
                filename: downloadedFile,
                size: stats.size
            });

            // Auto-delete after 10 minutes to save storage
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ Auto-deleted: ${downloadedFile}`);
                }
            }, 10 * 60 * 1000);
        } else {
            console.error('❌ File not found after download');
            res.status(500).json({ error: 'Download completed but file not found' });
        }
    });
});

// Cleanup endpoint (manual)
app.post('/api/cleanup', (req, res) => {
    const files = fs.readdirSync(videosDir);
    let deleted = 0;

    files.forEach(file => {
        const filePath = path.join(videosDir, file);
        fs.unlinkSync(filePath);
        deleted++;
    });

    res.json({ message: `Deleted ${deleted} files` });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.json({ 
            message: 'Reel Downloader API', 
            endpoints: {
                download: 'POST /api/download',
                health: 'GET /api/health'
            }
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`
🚀 Reel Downloader Server
━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: ${PORT}
📁 Videos: ${videosDir}
🌐 URL: http://localhost:${PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});
