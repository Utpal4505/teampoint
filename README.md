<div align="center">

# TeamPoint

### Stop managing work. Start finishing it.

TeamPoint is a focused workspace for small startup and dev teams to manage tasks,
project discussions, decisions, meetings, and action items without the clutter of
heavy project management tools.

[![Status](https://img.shields.io/badge/status-beta_early_access-22c55e?style=for-the-badge)](#project-status)
[![Frontend](https://img.shields.io/badge/frontend-Next.js_16-111827?style=for-the-badge&logo=nextdotjs)](#tech-stack)
[![Backend](https://img.shields.io/badge/backend-Express_5-111827?style=for-the-badge&logo=express)](#tech-stack)
[![Database](https://img.shields.io/badge/database-PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/typescript-first-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](#tech-stack)

</div>

---

## What is TeamPoint?

TeamPoint is a proof-of-concept moving into beta for teams that need structure,
but do not want to spend half their day managing the tool.

It connects the three places where small teams usually lose momentum: tasks, discussions, and meetings.

> TeamPoint is not trying to become the biggest workspace. It is trying to become
> the cleanest path from conversation to finished work.

## Tech Stack Summary

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Zustand, React Query
- **Backend**: Node.js, Express 5, TypeScript (ESM), Socket.IO
- **Database**: PostgreSQL, Prisma ORM
- **Infrastructure**: Turborepo (Monorepo), Docker, Cloudflare R2

## Documentation

Detailed documentation can be found in the `docs/` directory:

- [Architecture Overview](docs/ARCHITECTURE.md) - System design, tech choices, and infrastructure
- [Development Setup Guide](docs/DEVELOPMENT.md) - How to run the project locally
- [API Conventions](docs/API_CONVENTIONS.md) - REST patterns, authentication, and responses

## Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/teampoint.git
   cd TeamPoint
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

3. **Database Setup**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Monorepo Structure

```
TeamPoint/
├── apps/
│   ├── backend/      # Express.js REST API + WebSocket server
│   └── frontend/     # Next.js web application
├── docs/             # Technical documentation
├── turbo.json        # Turborepo build pipeline configuration
└── package.json      # Shared dependencies and monorepo scripts
```

## Contributing

See our [Development Guide](docs/DEVELOPMENT.md) for details on how to add features, run tests, and adhere to our coding conventions.

## License

UNLICENSED
