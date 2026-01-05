# Deployment Guide for CoreBase

This guide covers how to deploy the CoreBase backend to a production environment.

## Prerequisites

- **Docker** and **Docker Compose** installed on the target server.
- A domain name (optional but recommended) pointing to your server IP.

## 1. Environment Configuration

1.  Clone the repository to your server.
2.  Copy `.env.example` to `.env`.
    ```bash
    cp .env.example .env
    ```
3.  **Critical**: Update the `.env` values for production:
    -   `NODE_ENV`: Set to `production`.
    -   `JWT_SECRET`: Generate a strong, random string (e.g., `openssl rand -base64 32`).
    -   `Eq_DB_PASSWORD`: Set a strong database password.
    -   `CORS_ORIGIN`: Set to your frontend domain (e.g., `https://your-app.com`).

## 2. Docker Deployment (Recommended)

We use Docker Compose to orchestrate the API and Database.

### Production Docker Compose
Create a `docker-compose.prod.yml` (or use the existing one with overrides) that restarts policies and exposes ports correctly.

To start the services in production mode:

```bash
# Build and start containers in the background
npm run docker:up
# OR directly:
docker-compose up -d --build
```

### Database Migrations
On the first deployment, you must apply the database schema:

```bash
# Run migrations inside the api container
docker-compose exec api npm run migrate
```

## 3. Manual Deployment (Node.js)

If you strictly cannot use Docker for the application logic:

1.  **Build the API**:
    ```bash
    cd packages/api
    npm install
    npm run build
    ```
2.  **Start the Process**:
    Use a process manager like PM2:
    ```bash
    npm install -g pm2
    pm2 start dist/server.js --name corebase-api
    ```
3.  **Database**: You will need a managed PostgreSQL instance or host it yourself. Update `DATABASE_URL` in `.env` accordingly.

## 4. Nginx Reverse Proxy (Optional)

It is recommended to put Nginx in front of the API for SSL (HTTPS).

Example Nginx config:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

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
Use **Certbot** to get free SSL certificates from Let's Encrypt.

## 5. Maintenance & Monitoring

-   **Logs**: Check logs via `docker-compose logs -f api`.
-   **Backups**: Regularly backup your PostgreSQL volume or use a managed database backup solution.
-   **Updates**: To update, pull the latest code and run:
    ```bash
    docker-compose down
    docker-compose up -d --build
    docker-compose exec api npm run migrate
    ```
