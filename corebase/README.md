# CoreBase - Backend-as-a-Service Platform

CoreBase is a self-hostable, open-source Backend-as-a-Service (BaaS) alternative to Supabase/Firebase. It provides a complete suite of tools to build your application backend in minutes.

## 🚀 Features

*   **Database**: Managed PostgreSQL with a visual table editor.
*   **Authentication**: Secure JWT-based auth (Email/Password, API Keys).
*   **Storage**: S3-compatible file storage with drag-and-drop bucket management.
*   **SQL Editor**: Run raw SQL queries directly from your dashboard.
*   **AI Assistant**: "CoreBot" agent to help you manage your backend via chat.
*   **Multi-Tenancy**: Project-based isolation for managing multiple apps.

## 🏗️ Architecture (Monorepo)

The project follows a modern monorepo structure:

```
/corebase
  /apps
    /api        # Node.js/Fastify Backend (Port 4000)
    /web        # Next.js Frontend Dashboard (Port 3000)
  /packages
    /shared     # Shared TypeScript types and utilities
  /scripts      # Database migration and utility scripts
```

## 🛠️ Tech Stack

*   **Backend**: Node.js, Fastify, TypeScript, PostgreSQL
*   **Frontend**: Next.js 14, TailwindCSS, Framer Motion, Lucide Icons
*   **Infrastructure**: Docker, Nginx, PM2

## 🏁 Getting Started

### Prerequisites
*   Node.js 20+
*   PostgreSQL 14+

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/corebase.git
cd corebase

# Install dependencies (from root)
npm install
```

### 2. Environment Setup

Create `.env` files for both apps.

**Root / Apps API (`apps/api/.env`):**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/corebase
JWT_SECRET=your-super-secure-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
```

**Apps Web (`apps/web/.env`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Database Setup

Ensure your PostgreSQL server is running and the database exists.

```bash
# Run migrations
npm run migrate
```

### 4. Running Locally

```bash
# Start both Backend and Frontend
npm run dev
```
*   Frontend: http://localhost:3000
*   Backend: http://localhost:4000

## 🚢 Deployment (Production)

We support deployment via **Docker** or **PM2** on any Ubuntu VPS (e.g., Hostinger, DigitalOcean).

### Option A: PM2 (Recommended for VPS)

1.  **Build** the project:
    ```bash
    npm run build
    ```
2.  **Start** with PM2:
    ```bash
    pm2 start ecosystem.config.js
    ```
3.  **Reverse Proxy** (Nginx) configuration is recommended to serve port 3000 and 4000 securely.

### Option B: Docker

```bash
docker-compose up -d --build
```

## 🔒 Security

*   **API Security**: All endpoints are protected via JWT or API Key middleware.
*   **Isolation**: Every project's data is logically isolated.
*   **Validation**: Zod is used for rigorous input validation.

## 📄 License

MIT License.
