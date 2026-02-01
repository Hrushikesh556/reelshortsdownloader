# 🚀 Hosting Guide for Reel & Shorts Video Downloader

This project requires **yt-dlp** and **ffmpeg** on the server, so you need a VPS or container-based hosting (NOT serverless like Vercel).

---

## 📊 Hosting Options Comparison

| Platform | Monthly Cost | Difficulty | Best For |
|----------|-------------|------------|----------|
| **Railway** | $5-20 | Easy | Quick deployment |
| **Render** | $7-25 | Easy | Beginners |
| **DigitalOcean** | $6-24 | Medium | Full control |
| **Hetzner** | $4-10 | Medium | Budget + EU users |
| **Linode** | $5-20 | Medium | Reliable VPS |
| **Vultr** | $5-20 | Medium | Global locations |
| **AWS EC2** | $5-50+ | Hard | Enterprise |
| **Oracle Cloud** | FREE | Medium | Always Free tier |
| **Contabo** | $5-10 | Medium | Best value storage |

---

## 🏆 RECOMMENDED: Railway (Easiest)

### Why Railway?
- One-click deploy from GitHub
- Auto-installs dependencies
- Free tier available
- Handles both frontend & backend

### Steps:

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/reel-downloader.git
git push -u origin main
```

2. **Go to [Railway.app](https://railway.app)**

3. **Create New Project → Deploy from GitHub**

4. **The Dockerfile is already included!** (No need to create one)

The project includes a production-ready `Dockerfile` that:
- Uses multi-stage build for smaller image
- Installs Python in a virtual environment (fixes pip warnings)
- Uses `npm install` instead of `npm ci` (fixes lockfile errors)
- Properly installs yt-dlp and ffmpeg
- Builds and serves the frontend from the backend

5. **Set Environment Variables in Railway Dashboard:**
```
PORT=5000
NODE_ENV=production
```

6. **Deploy!** Railway will automatically detect the Dockerfile and build.

### Troubleshooting Railway:

**If you still get npm errors:**
- Rename `Dockerfile` to `Dockerfile.backup`
- Rename `Dockerfile.simple` to `Dockerfile`
- The simple version uses a single-stage build which is more reliable

**If using Nixpacks (Railway's default):**
The project includes `nixpacks.toml` for automatic configuration.

**To use Nixpacks instead of Docker:**
1. Go to Railway Dashboard → Settings
2. Change Builder from "Dockerfile" to "Nixpacks"
3. Redeploy

---

## 🌊 Option 2: DigitalOcean Droplet ($6/month)

### Step 1: Create Droplet
1. Go to [DigitalOcean](https://digitalocean.com)
2. Create Droplet → Ubuntu 22.04 → Basic → $6/month
3. Add SSH key or password

### Step 2: Connect & Setup
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install dependencies
apt install -y ffmpeg python3-pip git nginx
pip3 install yt-dlp

# Clone your project
git clone https://github.com/yourusername/reel-downloader.git
cd reel-downloader

# Install and build frontend
npm install
npm run build

# Setup backend
cd server
npm install
mkdir -p public/videos
cp -r ../dist/* public/

# Install PM2 for process management
npm install -g pm2
pm2 start index.js --name "downloader"
pm2 save
pm2 startup
```

### Step 3: Setup Nginx
```bash
nano /etc/nginx/sites-available/downloader
```

Add this config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /videos/ {
        alias /root/reel-downloader/server/public/videos/;
        expires 1h;
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/downloader /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 4: Add SSL (Free with Certbot)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

---

## ☁️ Option 3: Render.com (Easy + Free Tier)

### Steps:

1. **Create `render.yaml` in root:**
```yaml
services:
  - type: web
    name: reel-downloader
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
```

2. **Create Dockerfile** (same as Railway above)

3. **Push to GitHub**

4. **Go to [Render.com](https://render.com) → New Web Service**

5. **Connect GitHub repo → Deploy**

---

## 🆓 Option 4: Oracle Cloud (ALWAYS FREE!)

Oracle offers a forever-free tier with 2 VMs!

### Steps:
1. Sign up at [Oracle Cloud](https://cloud.oracle.com)
2. Create Compute Instance → Ubuntu → VM.Standard.E2.1.Micro (FREE)
3. Follow DigitalOcean setup steps above

---

## 🐳 Docker Deployment (Any Platform)

### Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./videos:/app/server/public/videos
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Deploy:
```bash
docker-compose up -d --build
```

---

## 📁 Production File Structure

```
your-server/
├── reel-downloader/
│   ├── server/
│   │   ├── index.js          # Express backend
│   │   ├── package.json
│   │   └── public/
│   │       ├── index.html    # Built React app
│   │       ├── assets/
│   │       └── videos/       # Downloaded videos
│   ├── dist/                 # Vite build output
│   └── Dockerfile
```

---

## 🔧 Server-Side Backend Code

Create `server/index.js`:
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

// Serve static files (React build + videos)
app.use(express.static(path.join(__dirname, 'public')));
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

    // Validate URL
    const validDomains = ['instagram.com', 'facebook.com', 'fb.watch', 'youtube.com', 'youtu.be'];
    const isValid = validDomains.some(domain => url.includes(domain));
    
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid URL. Only Instagram, Facebook, and YouTube are supported.' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const outputTemplate = path.join(videosDir, `video_${timestamp}.%(ext)s`);

    const command = `yt-dlp -f "best[ext=mp4]/best" --merge-output-format mp4 -o "${outputTemplate}" "${url}"`;

    exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
        if (error) {
            console.error('Download error:', error.message);
            return res.status(500).json({ 
                error: 'Failed to download video. Please check the URL and try again.' 
            });
        }

        // Find the downloaded file
        const files = fs.readdirSync(videosDir);
        const downloadedFile = files.find(f => f.includes(`video_${timestamp}`));

        if (downloadedFile) {
            res.json({ 
                success: true,
                file: `/videos/${downloadedFile}`,
                filename: downloadedFile
            });

            // Auto-delete after 10 minutes
            setTimeout(() => {
                const filePath = path.join(videosDir, downloadedFile);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted: ${downloadedFile}`);
                }
            }, 10 * 60 * 1000);
        } else {
            res.status(500).json({ error: 'Download completed but file not found' });
        }
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

Create `server/package.json`:
```json
{
  "name": "reel-downloader-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🌐 Domain Setup

1. **Buy domain** from Namecheap, GoDaddy, or Cloudflare
2. **Add A Record** pointing to your server IP
3. **Wait 5-30 minutes** for DNS propagation
4. **Add SSL** using Certbot (see above)

---

## 📈 Scaling Tips

1. **Add Redis** for caching and rate limiting
2. **Use Cloudflare** for CDN and DDoS protection
3. **Set up cron job** to clean old videos:
   ```bash
   # Add to crontab -e
   0 * * * * find /path/to/videos -mmin +60 -delete
   ```

---

## ❓ Need Help?

- Railway Docs: https://docs.railway.app
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- Render Docs: https://render.com/docs

---

## 🎉 Quick Start Commands

```bash
# Clone & Setup
git clone https://github.com/yourusername/reel-downloader.git
cd reel-downloader

# Install dependencies
npm install
cd server && npm install && cd ..

# Build frontend
npm run build

# Copy to server public
cp -r dist/* server/public/

# Start server
cd server && npm start
```

Your app will be live at `http://your-server-ip:5000` 🚀
