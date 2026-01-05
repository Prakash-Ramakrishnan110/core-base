# CoreBase

**Backend-as-a-Service platform** - Self-hostable with auto-generated REST APIs

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start PostgreSQL
npm run docker:up

# Run migrations
npm run migrate

# Start dev server
npm run dev
```

Server runs at `http://localhost:3000`

## 📚 Documentation

- [Implementation Plan](../.gemini/antigravity/brain/5ee7707e-51ca-434e-bb5a-c41f78dfa519/implementation_plan.md)
- [Database Schema](../.gemini/antigravity/brain/5ee7707e-51ca-434e-bb5a-c41f78dfa519/database_schema.md)
- [API Design](../.gemini/antigravity/brain/5ee7707e-51ca-434e-bb5a-c41f78dfa519/api_design.md)
- [Auth Implementation](../.gemini/antigravity/brain/5ee7707e-51ca-434e-bb5a-c41f78dfa519/auth_implementation.md)

## 🏗️ Project Structure

```
corebase/
├── packages/
│   ├── api/           # Main API server
│   └── dashboard/     # Next.js dashboard (Week 11)
├── migrations/        # SQL migrations
├── docker/           # Docker configs
└── docs/             # Documentation
```

## 🎯 MVP Features

- ✅ Email/password authentication with JWT
- ✅ Multi-project management
- ✅ Dynamic table creation & Record CRUD
- ✅ Auto-generated REST APIs
- ✅ Audit Logs & Activity Tracking
- ✅ API key management

## 🛠️ Tech Stack

- **Backend:** Node.js 20 + TypeScript + Fastify
- **Database:** PostgreSQL 16
- **Frontend:** Next.js 14 (Week 11)
- **Infrastructure:** Docker + Docker Compose

## 📝 License

MIT
