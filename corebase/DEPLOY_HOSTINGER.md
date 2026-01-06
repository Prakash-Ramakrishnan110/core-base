# 🚀 CoreBase Production Deployment Guide (Hostinger VPS)

This is the official production deployment guide for the **CoreBase Backend-as-a-Service (BaaS)** platform. Follow these steps to deploy a secure, scalable, and industry-standard instance on Ubuntu 20.04/22.04 LTS.

## 📋 Prerequisites

*   **Server**: Hostinger VPS (or any Ubuntu 22.04 VPS).
    *   Recommended: 4GB RAM, 2 vCPUs.
*   **Domain**: A valid domain name (e.g., `yourdomain.com`) with DNS records:
    *   `A` record for `@` (yourdomain.com) -> VPS IP
    *   `A` record for `www` (www.yourdomain.com) -> VPS IP
    *   `A` record for `api` (api.yourdomain.com) -> VPS IP
*   **Access**: SSH access as `root`.

---

## 1. Server Hardening & Security (Critical)

First, secure the server network.

1.  **Update System Packages**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2.  **Configure Firewall (UFW)**:
    It is crucial to allow SSH connections before enabling the firewall to avoid locking yourself out.
    ```bash
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw enable
    ```
    *   *Verification*: Run `sudo ufw status` to confirm active rules.

3.  **Install Fail2Ban** (Optional but Recommended):
    Protects SSH from brute-force attacks.
    ```bash
    sudo apt install -y fail2ban
    sudo systemctl start fail2ban
    sudo systemctl enable fail2ban
    ```

---

## 2. Environment Setup

Install the required runtime environments.

1.  **Install Node.js 20 (LTS)**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs build-essential
    ```
    *   *Verify*: `node -v` (Should be v20.x.x)

2.  **Install PM2 (Process Manager)**:
    PM2 ensures your apps run in the background and restart on failure.
    ```bash
    sudo npm install -g pm2
    ```

3.  **Install Nginx (Web Server/Proxy)**:
    ```bash
    sudo apt install -y nginx certbot python3-certbot-nginx
    ```

---

## 3. Database Configuration (PostgreSQL)

Install and secure the database.

1.  **Install PostgreSQL**:
    ```bash
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```

2.  **Secure Database Setup**:
    Switch to the postgres user to manage the database.
    ```bash
    sudo -i -u postgres
    psql
    ```

    Run the following SQL commands (Copy carefully):
    ```sql
    -- 1. Create DataBase
    CREATE DATABASE corebase;

    -- 2. Create Dedicated User (Replace 'secure_password' with a STRONG generated password)
    CREATE USER coreuser WITH ENCRYPTED PASSWORD 'secure_password';

    -- 3. Grant Privileges & Ownership
    GRANT ALL PRIVILEGES ON DATABASE corebase TO coreuser;
    ALTER DATABASE corebase OWNER TO coreuser;

    -- 4. Exit
    \q
    ```

    Exit the postgres user shell:
    ```bash
    exit
    ```

    *   *Security Note*: By default, Postgres listens on `127.0.0.1`. **Do NOT** change this to `0.0.0.0` unless you explicitly need external access. UFW blocks port 5432 externally by default, which is good.

---

## 4. Application Deployment

Deploy the CoreBase monorepo.

1.  **Clone Repository**:
    ```bash
    cd /var/www
    git clone https://github.com/Prakash-Ramakrishnan110/core-base.git
    cd core-base
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:

    **Backend API (`apps/api/.env`):**
    ```bash
    nano apps/api/.env
    ```
    ```env
    PORT=4000
    NODE_ENV=production
    # Use 127.0.0.1 for local connection
    DATABASE_URL=postgresql://coreuser:secure_password@127.0.0.1:5432/corebase
    JWT_SECRET=YOUR_GENERATED_SECURE_JWT_SECRET_KEY
    CORS_ORIGIN=https://yourdomain.com
    GEMINI_API_KEY=your_google_ai_key
    ```

    **Frontend Web (`apps/web/.env`):**
    ```bash
    nano apps/web/.env
    ```
    ```env
    NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    ```

4.  **Build Code**:
    Compile TypeScript to JavaScript for production performance.
    ```bash
    npm run build
    ```

5.  **Run Migrations**:
    Apply database schema changes.
    ```bash
    npm run migrate
    ```

---

## 5. Process Management (PM2)

Start the services using the ecosystem configuration. This ensures zero-downtime reloads and automatic restarts.

1.  **Start Services**:
    ```bash
    pm2 start ecosystem.config.js
    ```

2.  **Verify Status**:
    ```bash
    pm2 list
    ```
    Both `corebase-api` and `corebase-web` should say `online`.

3.  **Configure Startup Persistence**:
    Ensure apps start if the server reboots.
    ```bash
    pm2 save
    pm2 startup
    # Run the command output by pm2 startup
    ```

---

## 6. Nginx Reverse Proxy Configuration (Production)

configure Nginx to forward traffic from standard ports (80/443) to your internal apps.

1.  **Create Configuration File**:
    ```bash
    sudo nano /etc/nginx/sites-available/corebase
    ```

2.  **Paste Configuration**:
    Replace `yourdomain.com` with your actual domain.

    ```nginx
    # Backend API (api.yourdomain.com)
    server {
        server_name api.yourdomain.com;

        location / {
            # Use 127.0.0.1 for slightly better performance than localhost
            proxy_pass http://127.0.0.1:4000;
            
            # Standard Proxy Headers
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            
            # Real IP Headers (Critical for Rate Limiting & Logs)
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # Frontend Dashboard (yourdomain.com + www)
    server {
        server_name yourdomain.com www.yourdomain.com;

        location / {
            proxy_pass http://127.0.0.1:3000;
            
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

3.  **Enable Site**:
    ```bash
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo ln -s /etc/nginx/sites-available/corebase /etc/nginx/sites-enabled/
    sudo nginx -t
    # If test is successful:
    sudo systemctl reload nginx
    ```

---

## 7. SSL Certificate Setup (HTTPS)

Secure your deployment with free certificates from Let's Encrypt.

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```
*   Follow the prompts. Select **Option 2 (Redirect)** to force HTTPS.

---

## ✅ Final Verification

1.  **Visit Dashboard**: `https://yourdomain.com`
    *   Should load the login page securely.
2.  **Test API**: `https://api.yourdomain.com/health`
    *   Should return `{"status": "healthy"}`.
3.  **Check Logs**: `pm2 logs`
    *   Ensure no errors in the console.

**Congratulations!** Your instance of CoreBase is now live and ready for production use.
