# Deploying CoreBase to Hostinger VPS

This guide explains how to deploy your CoreBase application (Next.js Frontend + Node.js Backend) to a Hostinger VPS.

## Prerequisites

1.  **Hostinger VPS Plan**: You need a VPS (Virtual Private Server), usually utilizing **Ubuntu 22.04 or 24.04**. Shared hosting is NOT recommended for complex Node.js backend platforms.
2.  **Domain Name**: Your custom domain (e.g., `corebase.com`).
3.  **SSH Access**: You must be able to verify you can log into your server via terminal.

---

## 1. Server Setup

Login to your VPS via SSH:
```bash
ssh root@your_vps_ip
```

Update your system and install necessary tools:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx
```

## 2. Install Node.js & PM2

Install Node.js (Version 20+):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 (Process Manager to keep your app running):
```bash
sudo npm install -g pm2
```

## 3. Clone & Build Your Code

Clone your repository to the server (e.g., in `/var/www/corebase`):
```bash
mkdir -p /var/www/corebase
cd /var/www/corebase
git clone https://github.com/Prakash-Ramakrishnan110/core-base.git .
```

Install dependencies and build:
```bash
# Install root dependencies
npm install

# Build the Frontend (Next.js)
cd packages/landing
npm install
npm run build
cd ../..

# Setup Backend
cd packages/api
npm install
npm run build # (If you have a build step for TS)
```

## 4. Configure Environment Variables

Create `.env` files for production.

**Backend (.env):**
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/corebase
JWT_SECRET=your_super_secure_secret
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```
*Note: You must rebuild the frontend after changing `NEXT_PUBLIC_` variables.*

## 5. Start Services with PM2

Start the API:
```bash
cd /var/www/corebase/packages/api
pm2 start src/index.ts --name "corebase-api" --interpreter ./node_modules/.bin/ts-node
```

Start the Frontend:
```bash
cd /var/www/corebase/packages/landing
pm2 start npm --name "corebase-web" -- start
```

Save the process list so they restart on reboot:
```bash
pm2 save
pm2 startup
```

## 6. Configure Nginx (Reverse Proxy)

This is the magic step that removes "localhost" and ports.

Create a config file: `/etc/nginx/sites-available/corebase`

```nginx
# Backend API (api.your-domain.com)
server {
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend (your-domain.com)
server {
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/corebase /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. SSL Certificates (HTTPS)

Secure your domain with free Let's Encrypt SSL:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

**Done!** Your app is now live at `https://your-domain.com`.
