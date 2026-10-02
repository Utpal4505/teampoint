# Development Setup Guide

Welcome to the TeamPoint development guide! This document explains how to set up your local environment and begin contributing.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

## Clone and Install

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TeamPoint
   ```

2. Install dependencies across the monorepo:
   ```bash
   npm install
   ```

## Environment Setup

You need to set up environment variables for both backend and frontend applications.

1. **Backend Environment**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```
   *Edit `apps/backend/.env` to include your PostgreSQL `DATABASE_URL` and other required keys.*

2. **Frontend Environment**
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env
   ```
   *Verify `NEXT_PUBLIC_API_URL` points to your backend URL (usually `http://localhost:8000`).*

## Database Setup

Initialize your PostgreSQL database and run the Prisma migrations:

1. Push the database schema:
   ```bash
   npm run db:migrate
   ```

2. Generate the Prisma client:
   ```bash
   npm run db:generate
   ```

3. (Optional) Seed the database with initial data:
   ```bash
   cd apps/backend
   npm run seed
   ```

## Running Development Servers

You can start the development servers using Turborepo from the root directory:

```bash
npm run dev
```

Alternatively, you can run them individually:
- **Backend**: `npm run dev --workspace=apps/backend`
- **Frontend**: `npm run dev --workspace=apps/frontend`

The applications will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Running Tests

Tests are run using Jest configured for ESM (`--experimental-vm-modules`).

Run all tests:
```bash
npm run test
```

For backend tests specifically:
```bash
npm run test --workspace=apps/backend
```

## Building for Production

To build the applications for production:

```bash
npm run build
```
This runs the `turbo build` pipeline, generating production assets in the respective `dist`/`.next` folders.

## Monorepo Commands

We use Turborepo for orchestrating monorepo tasks. Run these from the root directory:

- `npm run dev`: Start all apps in development mode.
- `npm run build`: Build all apps and packages.
- `npm run test`: Run tests across all workspaces.
- `npm run lint`: Lint all apps.
- `npm run db:migrate`: Run database migrations.
- `npm run db:generate`: Generate Prisma Client.

## Project Structure Overview

```text
TeamPoint/
├── apps/
│   ├── backend/      # Express 5 API
│   │   ├── src/      # Application code
│   │   └── prisma/   # Database schema and migrations
│   └── frontend/     # Next.js 16 Web App
│       ├── app/      # Next.js App Router
│       └── features/ # Domain-specific components
├── turbo.json        # Turborepo configuration
└── package.json      # Monorepo dependencies and scripts
```

## Common Tasks

### Adding a New Backend Module

1. Create a new directory in `apps/backend/src/modules/` (e.g., `myModule/`).
2. Create the standard files: `service.ts`, `controller.ts`, `route.ts`, and `schema.ts`.
3. Export the module router from `route.ts`.
4. Register the router in `apps/backend/src/app.ts` or the main API index.
5. Use `.js` extensions for local imports (e.g., `import { myService } from './service.js'`).

### Modifying the Database

1. Update the schema in `apps/backend/prisma/schema.prisma`.
2. Generate a migration: `npx prisma migrate dev --name your-change-name` (run from `apps/backend`).
3. Generate the client: `npm run db:generate` (from root).

### Adding a New Frontend Feature

1. Add domain logic and components in `apps/frontend/features/<feature-name>/`.
2. Keep UI components inside `apps/frontend/components/ui/` if they are reusable globally.
3. Hook up API calls using React Query in the feature folder.
