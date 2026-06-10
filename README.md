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

## Table of Contents

- [What is TeamPoint?](#what-is-teampoint)
- [Why TeamPoint?](#why-teampoint)
- [Who it's For](#who-its-for)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Project Status](#project-status)
- [License](#license)

---

## What is TeamPoint?

TeamPoint is a proof-of-concept moving into beta for teams that need structure,
but do not want to spend half their day managing the tool.

It connects the three places where small teams usually lose momentum:

| Work area   | TeamPoint helps you                                                             |
| ----------- | ------------------------------------------------------------------------------- |
| Tasks       | Create, assign, prioritize, and complete work without overthinking the process. |
| Discussions | Keep project conversations close to the work and turn outcomes into decisions.  |
| Meetings    | Capture action items and move them into tasks before they disappear.            |

> TeamPoint is not trying to become the biggest workspace. It is trying to become
> the cleanest path from conversation to finished work.

## Why TeamPoint?

Small teams often try to force their workflow into tools built for bigger,
heavier organizations. TeamPoint takes the opposite approach.

| Typical tools              | TeamPoint                                  |
| -------------------------- | ------------------------------------------ |
| Feature-heavy              | Focused workflow                           |
| Complex setup              | Start in minutes                           |
| Endless options            | Clear next step                            |
| Work scattered across apps | Tasks, discussions, and meetings connected |

## Who it's For

TeamPoint is designed for:

- **Small startup teams** that want to move faster without process overhead.
- **Dev teams** that need tasks, discussions, meetings, and ownership in one place.
- **Founders and builders** who want clarity without setting up a full enterprise tool.
- **Early teams** that want a lightweight product workflow before adopting heavier systems.

It is probably not the right fit if you need enterprise-grade customization,
deep reporting, or a fully mature Jira-style workflow engine today.

## Product Flow

```mermaid
flowchart LR
  A["Create task"] --> B["Assign owner"]
  B --> C["Complete work"]

  D["Start discussion"] --> E["Save decision"]
  E --> C

  F["Run meeting"] --> G["Capture action items"]
  G --> A
```

## Features

### Core Modules

| Module                 | Capabilities                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Workspaces**         | Multi-workspace support, invite members, manage team access with role-based permissions (OWNER, ADMIN, MEMBER).                                                   |
| **Projects**           | Organize work into projects with overview, members, tasks, documents, discussions, and meetings. Status tracking (ACTIVE, ARCHIVED, ONHOLD, COMPLETED, DELETED).  |
| **Tasks**              | Dual task types (Personal & Project), priority levels (LOW, MEDIUM, HIGH, URGENT), status workflow (TODO → IN_PROGRESS → DONE → CANCELLED), assignees, due dates. |
| **Discussions**        | Project-level threaded conversations with resolution tracking and message threads.                                                                                |
| **Meetings**           | Schedule, track, complete meetings with participant roles (HOST, PARTICIPANT) and status management.                                                              |
| **Documents**          | Upload and link project documents, associate with tasks/discussions/milestones.                                                                                   |
| **Members**            | Invite teammates, manage roles at workspace and project levels, track membership status.                                                                          |
| **Goals & Milestones** | Track project goals with completion status, define milestones for project tracking.                                                                               |
| **Activity Log**       | Complete audit trail of all workspace actions for compliance and debugging.                                                                                       |
| **Integrations**       | OAuth integration foundations for Google and GitHub (ready for expansion).                                                                                        |
| **Feedback**           | In-app bug reporting and feedback collection with categorization.                                                                                                 |
| **AI Features**        | Foundation infrastructure for AI-powered workflow helpers (planned roadmap).                                                                                      |

## Tech Stack

### Frontend

| Technology           | Purpose                        |
| -------------------- | ------------------------------ |
| **Next.js 16**       | React framework for production |
| **React 19**         | UI component library           |
| **TypeScript**       | Type-safe development          |
| **Tailwind CSS 4**   | Utility-first CSS framework    |
| **shadcn/ui**        | High-quality React components  |
| **TanStack Query**   | Server state management        |
| **Zustand**          | Client state management        |
| **Socket.IO Client** | Real-time communication        |
| **React Hook Form**  | Form management and validation |
| **Zod**              | Schema validation              |

### Backend

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| **Node.js**     | JavaScript runtime                    |
| **Express 5**   | Web framework                         |
| **TypeScript**  | Type-safe backend development         |
| **Prisma 7**    | ORM and database management           |
| **PostgreSQL**  | Relational database                   |
| **Socket.IO**   | Real-time bidirectional communication |
| **Passport.js** | Authentication middleware             |
| **JWT**         | Token-based authentication            |
| **Multer**      | File upload handling                  |
| **Bcrypt**      | Password hashing                      |

### DevOps & Infrastructure

| Technology                         | Purpose                   |
| ---------------------------------- | ------------------------- |
| **Docker**                         | Containerization          |
| **Render**                         | Cloud deployment platform |
| **Turbo**                          | Monorepo build system     |
| **PostgreSQL (RDS/Neon/Supabase)** | Managed database hosting  |
| **Cloudflare R2 / AWS S3**         | Object storage            |

### Observability & Monitoring

| Technology           | Purpose                             |
| -------------------- | ----------------------------------- |
| **PostHog**          | Product analytics and feature flags |
| **Winston**          | Application logging                 |
| **Discord Webhooks** | Alert notifications                 |

### Testing & Code Quality

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| **Jest**        | Testing framework           |
| **Supertest**   | HTTP testing library        |
| **ESLint**      | Code linting                |
| **Prettier**    | Code formatting             |
| **Husky**       | Git hooks                   |
| **lint-staged** | Run linters on staged files |

---

## Project Structure

```
TeamPoint/
├── apps/
│   ├── backend/                 # Node.js/Express backend server
│   │   ├── src/
│   │   │   ├── modules/         # Feature modules (workspace, project, task, etc.)
│   │   │   ├── middlewares/     # Express middlewares (auth, error, logging)
│   │   │   ├── services/        # Shared business logic services
│   │   │   ├── config/          # Configuration files
│   │   │   ├── types/           # TypeScript type definitions
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── app.ts           # Express app setup
│   │   │   └── index.ts         # Entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── seed/            # Database seeding
│   │   ├── tests/               # Test suites (unit, integration)
│   │   └── package.json
│   │
│   └── frontend/                 # Next.js frontend application
│       ├── app/                  # Next.js App Router
│       │   ├── (auth)/           # Authentication pages
│       │   ├── (public)/         # Public pages
│       │   └── layout.tsx        # Root layout
│       ├── components/           # Reusable React components
│       │   ├── ui/               # shadcn/ui components
│       │   ├── auth/             # Auth-related components
│       │   ├── dashboard/        # Dashboard components
│       │   ├── tasks/            # Task management components
│       │   ├── meetings/         # Meeting management components
│       │   ├── projects/         # Project management components
│       │   └── ...
│       ├── features/             # Feature-specific modules
│       │   ├── auth/
│       │   ├── workspace/
│       │   ├── projects/
│       │   ├── tasks/
│       │   ├── meetings/
│       │   ├── discussions/
│       │   └── ...
│       ├── hooks/                # Custom React hooks
│       ├── lib/                  # Utility functions and API clients
│       ├── store/                # Zustand state stores
│       └── package.json
│
├── packages/                     # Shared packages (if any)
├── turbo.json                    # Turbo build configuration
├── package.json                  # Root package configuration
└── render.yaml                   # Deployment configuration

```

### Backend Module Structure

Each backend module follows a consistent pattern:

```
modules/
├── [feature]/
│   ├── service.ts        # Business logic and database queries
│   ├── controller.ts     # HTTP request handling
│   ├── route.ts          # Endpoint definitions
│   ├── schema.ts         # Zod validation schemas
│   ├── permission.ts     # Role-based access control
│   ├── types.ts          # TypeScript interfaces
│   └── index.ts          # Module exports
```

### Backend Modules

The backend is organized into 21 feature modules:

1. **auth/** - Authentication, OAuth (Google/GitHub), JWT token management
2. **workspace/** - Workspace creation, management, member handling
3. **project/** - Project CRUD, status management, project members
4. **projectMember/** - Project-level member roles and permissions
5. **tasks/** - Task CRUD, status updates, priority, assignments
6. **meeting/** - Meeting scheduling, participant management
7. **discussion/** - Discussions and threaded conversations
8. **message/** - Real-time messaging within discussions
9. **document/** - File uploads, document associations
10. **documentLinks/** - Link documents to tasks/discussions/milestones
11. **goal/** - Goal creation and tracking
12. **milestone/** - Milestone management and tracking
13. **inviteMember/** - User invitation and onboarding flow
14. **user/** - User profile and settings
15. **activityLog/** - Audit trail and activity tracking
16. **feedback/** - In-app bug reports and feedback collection
17. **bug-report/** - Bug report submission and tracking
18. **integration/** - OAuth and third-party integrations
19. **calender/** - Calendar and scheduling features
20. **upload/** - File upload handling and storage
21. **workspaceLeave/** - Leave request management

---

## Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **PostgreSQL** (v13 or higher)
- **Docker** (optional, for containerized development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/teampoint.git
   cd TeamPoint
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.development` file in the `apps/backend` directory:

   ```bash
   # Copy from the example
   cp apps/backend/.env.example apps/backend/.env.development
   ```

   Configure the environment variables (see [Environment Variables](#environment-variables) section)

4. **Set up the database**

   ```bash
   # Run migrations
   npm run db:migrate

   # Generate Prisma Client
   npm run db:generate

   # (Optional) Seed the database
   cd apps/backend && npm run seed
   ```

5. **Start the development servers**

   **Option A: Using the start script (Windows)**

   ```bash
   ./start.bat
   ```

   **Option B: Using npm commands**

   Terminal 1 - Backend:

   ```bash
   npm run dev --workspace=apps/backend
   ```

   Terminal 2 - Frontend:

   ```bash
   npm run dev --workspace=apps/frontend
   ```

   Terminal 3 - Database Studio (optional):

   ```bash
   cd apps/backend && npx prisma studio
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000 (or configured PORT)
   - Prisma Studio: http://localhost:5555 (if running)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser                               │
└─────────────┬───────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────┐
│         Frontend (Next.js + React)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Pages & Components (shadcn/ui, Tailwind)         │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ React Hooks & Form Management               │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ State Management (Zustand, React Query)      │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ API Client (Axios) + Socket.IO Client             │ │
│  └─────┬──────────────────────────────────────┬───────┘ │
└────────┼──────────────────────────────────────┼─────────┘
         │ HTTP/REST                             │ WebSocket
         │                                       │
┌────────▼───────────────────────────────────────▼─────────┐
│         Backend (Express + Node.js)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Middleware Stack                                  │ │
│  │ (Auth, CORS, Rate Limit, Error Handling)        │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Router & Controllers                              │ │
│  │ /workspace, /project, /task, /meeting, etc.      │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Service Layer (Business Logic)                    │ │
│  │ Workspace, Project, Task, Meeting Services        │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Socket.IO Server (Real-time Updates)              │ │
│  └────────────────────────────────────────────────────┘ │
└─────┬──────────────────────────────────────────────────┘
      │ SQL (Prisma ORM)
      │
┌─────▼──────────────────────────────────────────────────┐
│         PostgreSQL Database                            │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Tables: Users, Workspaces, Projects, Tasks,     │ │
│  │ Meetings, Discussions, Documents, ActivityLog   │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User ──Login──> OAuth Provider (Google/GitHub) ──Token──> Backend
                                                           ├─ Verify
                                                           ├─ Create/Update User
                                                           └─ Generate JWT

Frontend <──JWT + Refresh Token────── Backend
         (Stored in httpOnly cookies)

Subsequent Requests:
Frontend ──Request + JWT──> Backend ──Validate──> Route Handler
```

---

## Backend Overview

### Authentication & Authorization

- **OAuth Integration**: Google and GitHub OAuth support via Passport.js
- **JWT-based Authentication**: Access tokens (short-lived) and refresh tokens (long-lived)
- **Role-Based Access Control (RBAC)**: Three-tier permission system
  - **Workspace Level**: OWNER, ADMIN, MEMBER
  - **Project Level**: OWNER, ADMIN, MEMBER
  - **Middleware Permission Checks**: Custom middleware for route protection

### Key Services

#### 1. Workspace Service (`modules/workspace/service.ts`)

- Create and manage workspaces
- Invite members to workspaces
- Handle member roles and permissions
- Workspace leave requests
- Archival and deletion

#### 2. Project Service (`modules/project/service.ts`)

- Create, read, update, delete projects
- Project status management (ACTIVE, ARCHIVED, ONHOLD, COMPLETED, DELETED)
- Project overview and metadata
- Link documents to projects

#### 3. Task Service (`modules/tasks/service.ts`)

- Full CRUD operations for tasks (Personal and Project)
- Task assignment to users
- Priority and status management
- Due date tracking
- Task description with rich content

#### 4. Meeting Service (`modules/meeting/service.ts`)

- Schedule meetings with participants
- Track meeting hosts and participants
- Capture meeting notes and action items
- Convert action items to tasks

#### 5. Discussion Service (`modules/discussion/service.ts`)

- Create project discussions
- Thread-based messaging
- Resolution tracking
- Link discussions to decisions

### Database Access Pattern

Uses **Prisma ORM** with TypeScript for type-safe database operations:

```typescript
// Example: Get workspace with members and projects
const workspace = await prisma.workspace.findUnique({
  where: { id: workspaceId },
  include: {
    members: true,
    projects: true,
  },
});
```

### Error Handling

Custom error middleware catches and formats errors:

```typescript
// Errors are caught and returned with appropriate HTTP status codes
// Examples: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
```

### Rate Limiting

Express rate limiting configured on sensitive endpoints to prevent abuse.

### Logging

Winston logging configured with:

- Console output in development
- File output in production
- Discord webhook alerts for critical errors

---

## Frontend Overview

### Project Structure

The frontend follows Next.js best practices with App Router:

#### Pages & Routing

- **Authentication Pages** (`app/(auth)/`)
  - Login/signup with OAuth integration
  - Profile setup
- **Protected Pages** (`app/(dashboard)/`)
  - Workspace switcher
  - Project list and details
  - Task management
  - Meetings and discussions
  - Team member management
  - Settings

#### Components

Organized by feature domain:

- **UI Components** (`components/ui/`) - Reusable shadcn/ui components
- **Auth Components** - Login forms, OAuth buttons
- **Workspace Components** - Workspace switcher, settings
- **Project Components** - Project list, project details, settings
- **Task Components** - Task board (Kanban), task list, task form
- **Meeting Components** - Meeting scheduler, participant management
- **Discussion Components** - Discussion threads, message input
- **Member Components** - Member list, invite form, role management

#### State Management

- **Zustand Stores** (`store/`)
  - `user.store.ts` - Current user state
  - `workspace.store.ts` - Current workspace state
- **React Query** - Server state management
  - Automatic caching and synchronization
  - Background refetching
  - Optimistic updates

#### Features

Feature modules organize complex domain logic:

- **auth/** - Login, logout, OAuth, token refresh
- **workspace/** - Workspace switching, member invitations
- **projects/** - Project CRUD, filtering, search
- **tasks/** - Task CRUD, status updates, assignments, filtering
- **meetings/** - Meeting scheduling, participant management
- **discussions/** - Discussion creation, threading, resolution
- **integration/** - OAuth callbacks, external integrations

#### Utilities

- **API Client** (`lib/api.ts`) - Axios-based HTTP client with interceptors
- **Socket Client** (`lib/socket.ts`) - Socket.IO client for real-time updates
- **Hooks** (`hooks/`)
  - `use-mobile.ts` - Responsive design detection
  - `use-socket.ts` - Socket event subscription
  - `useworkspaceid.ts` - Current workspace ID hook

### UI/UX Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode Support** - Theme switching via `next-themes`
- **Notifications** - Toast notifications via `sonner`
- **Drag & Drop** - Task reordering with `@dnd-kit`
- **Data Tables** - Advanced tables with `TanStack Table`
- **Modals & Dialogs** - Using Radix UI primitives
- **Date Picking** - Date and time selection via `react-day-picker`
- **Form Validation** - Zod + React Hook Form integration

---

## Database Schema

### Core Entities

```prisma
User
  ├── OAuth providers (Google, GitHub)
  ├── Workspaces (many)
  ├── Tasks (many)
  ├── Meetings (many)
  └── Comments (many)

Workspace
  ├── Members (many - with roles)
  ├── Projects (many)
  ├── Tasks (many)
  ├── Goals (many)
  ├── ActivityLog (many)
  └── Invitations (many)

Project
  ├── Members (many - with roles)
  ├── Tasks (many)
  ├── Meetings (many)
  ├── Discussions (many)
  ├── Documents (many)
  ├── Milestones (many)
  └── ActivityLog (many)

Task
  ├── Assignee (one user)
  ├── Comments (many)
  ├── Documents (many - linked)
  ├── ActivityLog (many)
  └── Subtasks (optional - represented as separate tasks)

Meeting
  ├── Participants (many - with roles)
  ├── ActionItems (many - converted to tasks)
  ├── Documents (many - linked)
  ├── Comments (many)
  └── ActivityLog (many)

Discussion
  ├── Messages/Comments (many - threaded)
  ├── Documents (many - linked)
  ├── ActivityLog (many)
  └── Resolution (one record)

Document
  ├── Associations (Task, Discussion, Milestone, Meeting)
  ├── Storage (S3/R2 reference)
  └── Metadata (size, type, etc.)
```

### Key Enums

**User & Workspace**

- `UserStatus`: ACTIVE, INACTIVE, BANNED
- `WorkspaceStatus`: ACTIVE, ARCHIVED, DELETED
- `WorkspaceRole`: OWNER, ADMIN, MEMBER
- `WorkspaceMemberStatus`: ACTIVE, INVITED, REMOVED, LEFT, BLOCKED

**Projects & Tasks**

- `ProjectStatus`: ACTIVE, ARCHIVED, ONHOLD, COMPLETED, DELETED
- `TaskStatus`: TODO, IN_PROGRESS, DONE, CANCELLED
- `TaskType`: PERSONAL, PROJECT
- `Priority`: LOW, MEDIUM, HIGH, URGENT

**Collaboration**

- `MeetingStatus`: SCHEDULED, COMPLETED, CANCELLED
- `MeetingRole`: HOST, PARTICIPANT
- `DiscussionStatus`: OPEN, CLOSED
- `DiscussionType`: GENERAL, TASK

**Tracking**

- `ActivityEntityType`: WORKSPACE, PROJECT, TASK, MEETING, DISCUSSION, GOAL, MILESTONE, DOCUMENT, COMMENT
- `ActivityAction`: CREATED, UPDATED, REMOVED, DELETED, COMPLETED, COMMENTED, ASSIGNED, CANCELLED
- `GoalStatus`: NOT_STARTED, IN_PROGRESS, ACHIEVED, MISSED

---

## API Documentation

### Base URL

Development: `http://localhost:8000`
Production: Configured via environment variables

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens are typically managed via httpOnly cookies.

### Main Endpoint Groups

#### Workspace Endpoints

- `GET /workspace` - Get all workspaces
- `POST /workspace` - Create workspace
- `GET /workspace/:id` - Get workspace details
- `PATCH /workspace/:id` - Update workspace
- `DELETE /workspace/:id` - Delete workspace
- `GET /workspace/:id/members` - Get workspace members
- `POST /workspace/:id/members` - Invite member

#### Project Endpoints

- `GET /project?workspaceId=:id` - List projects
- `POST /project` - Create project
- `GET /project/:id` - Get project details
- `PATCH /project/:id` - Update project
- `DELETE /project/:id` - Delete project

#### Task Endpoints

- `GET /task?projectId=:id` - List tasks
- `POST /task` - Create task
- `GET /task/:id` - Get task details
- `PATCH /task/:id` - Update task
- `DELETE /task/:id` - Delete task

#### Meeting Endpoints

- `GET /meeting?projectId=:id` - List meetings
- `POST /meeting` - Create meeting
- `GET /meeting/:id` - Get meeting details
- `PATCH /meeting/:id` - Update meeting
- `DELETE /meeting/:id` - Delete meeting

#### Discussion Endpoints

- `GET /discussion?projectId=:id` - List discussions
- `POST /discussion` - Create discussion
- `GET /discussion/:id` - Get discussion details
- `POST /discussion/:id/messages` - Add message
- `PATCH /discussion/:id` - Update discussion

### Real-time Events (Socket.IO)

Connected clients receive real-time updates:

- `task:created` - New task created
- `task:updated` - Task updated
- `meeting:scheduled` - New meeting
- `discussion:message` - New message in discussion
- `workspace:member:joined` - Member joined workspace
- `activity:log` - Activity logged

---

## Development

### Development Workflow

1. **Create a branch** for your feature

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** to backend or frontend

3. **Run tests** to ensure nothing breaks

   ```bash
   npm run test
   ```

4. **Run linting** to maintain code quality

   ```bash
   npm run lint
   ```

5. **Format code**

   ```bash
   npm run lint:fix
   npm run format:fix
   ```

6. **Commit changes** following conventional commits

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

7. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Adding a New Feature

#### Backend

1. Create a new module directory: `apps/backend/src/modules/[feature]/`
2. Create files:
   - `service.ts` - Business logic
   - `controller.ts` - HTTP handlers
   - `route.ts` - Endpoint definitions
   - `schema.ts` - Validation schemas
   - `permission.ts` - Access control
   - `types.ts` - TypeScript interfaces
3. Add database models to `prisma/schema.prisma`
4. Generate migration: `npm run db:migrate`
5. Add tests in `tests/unit/` or `tests/integration/`

#### Frontend

1. Create feature directory: `apps/frontend/features/[feature]/`
2. Create feature-specific hooks and utilities
3. Create components: `apps/frontend/components/[feature]/`
4. Create or update pages in `apps/frontend/app/`
5. Update state management if needed
6. Add tests

### Git Hooks

Husky and lint-staged are configured to:

- Run linters on staged files before commit
- Prevent committing code with linting errors
- Auto-format code on commit

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
apps/backend/tests/
├── unit/                    # Unit tests for services
│   ├── workspace.test.ts
│   ├── project.test.ts
│   └── ...
├── integration/             # Integration tests for APIs
│   ├── auth.test.ts
│   ├── workspace.test.ts
│   └── ...
├── helpers/                 # Test utilities
└── setup.ts                 # Jest configuration
```

### Testing Strategy

- **Unit Tests**: Test individual services and utilities in isolation
- **Integration Tests**: Test API endpoints with actual database
- **Mock Data**: Use seed data or factories for consistent test data

---

## Deployment

### Docker Deployment

#### Build Docker Image

```bash
cd apps/backend
docker build -t teampoint-backend .
```

#### Run Container

```bash
docker run -d \
  --name teampoint-backend \
  -p 8000:8000 \
  --env-file .env.production \
  teampoint-backend
```

#### Docker Compose (Local Development)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: teampoint
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./apps/backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/teampoint
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Deploying to Render

See [DEPLOYMENT.md](./apps/backend/DEPLOYMENT.md) for detailed Render deployment instructions.

The `render.yaml` file configures:

- Web service for backend
- Health check endpoint
- Environment variables
- Build and start commands

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build successful
- [ ] Health check endpoint accessible
- [ ] Tests passing
- [ ] Linting passing
- [ ] Environment-specific secrets set
- [ ] Monitoring configured (PostHog, Discord webhooks)

---

## Environment Variables

### Backend Configuration

Create `.env.development` or `.env.production` in `apps/backend/`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/teampoint

# Server
PORT=8000
NODE_ENV=development

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback

# OAuth (GitHub)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:8000/auth/github/callback

# File Storage (Cloudflare R2 or AWS S3)
AWS_REGION=auto
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
R2_ENDPOINT=your-r2-endpoint
BUCKET_NAME=your-bucket-name

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# Observability
POSTHOG_API_KEY=your-posthog-api-key
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

Create `.env.local` in `apps/frontend/`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=your-posthog-host

# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow the coding standards** (TypeScript, ESLint, Prettier)
3. **Write tests** for new features
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

### Code Standards

- **TypeScript**: Strict mode enabled, full type coverage
- **ESLint**: Enforce coding standards
- **Prettier**: Automatic code formatting
- **Naming**: Camelcase for variables/functions, PascalCase for types/classes

### Commit Message Format

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: refactor code
test: add tests
chore: update dependencies
```

---

## Project Status

### Current Status: Beta Early Access

TeamPoint is actively developed and in beta. The core features are stable and ready for early users and feedback.

### Completed Features ✅

- Multi-workspace management
- Projects with hierarchy
- Task management (Kanban/List views)
- Discussions and messaging
- Meeting scheduling and tracking
- Member management and invitations
- OAuth integration (Google, GitHub)
- Role-based access control
- File upload and document linking
- Activity logging
- Real-time updates via Socket.IO
- In-app feedback and bug reporting

### In Progress 🚀

- Advanced reporting and analytics
- Task automation and workflows
- AI-powered features (planning, suggestions)
- Calendar integration
- Mobile app support
- Performance optimization
- Enterprise features

### Known Limitations & Areas for Improvement

See [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) and [AI_FEATURE_STRATEGY.md](./AI_FEATURE_STRATEGY.md) for detailed architectural considerations and planned improvements.

---

## Support & Questions

- **Issues**: Found a bug? [Create an issue](https://github.com/yourusername/teampoint/issues)
- **Discussions**: Have questions? [Start a discussion](https://github.com/yourusername/teampoint/discussions)
- **Email**: contact@teampoint.dev (if applicable)

---

## License

This project is licensed under the UNLICENSED license. All rights reserved.

---

## Acknowledgments

Built with ❤️ by Utpal and the TeamPoint team.

Special thanks to:

- Next.js and React communities
- Express.js framework
- Prisma ORM
- shadcn/ui components
- All open-source contributors

## Architecture

```mermaid
flowchart TB
  User["User"] --> Web["Next.js frontend"]
  Web --> API["Express API"]
  Web --> Socket["Socket.IO client"]
  Socket --> API
  API --> DB["PostgreSQL via Prisma"]
  API --> Storage["R2 object storage"]
  API --> OAuth["Google / GitHub OAuth"]
  API --> AI["OpenAI service"]
  API --> Analytics["PostHog"]
```

## Repository structure

```text
TeamPoint/
|-- backend/                 # Express API, Prisma, modules, services, tests
|   |-- prisma/              # Schema, migrations, seed data
|   |-- src/
|   |   |-- modules/         # Auth, workspace, project, tasks, meetings, etc.
|   |   |-- middlewares/     # Auth, validation, rate limits, logging
|   |   |-- services/        # Socket, OpenAI, Discord
|   |   `-- utils/           # Shared backend helpers
|   `-- tests/               # Unit/integration test setup
|-- frontend/                # Next.js app
|   |-- app/                 # App Router pages and layouts
|   |-- components/          # UI, landing, auth, dashboard, project components
|   |-- features/            # API hooks, schemas, feature types
|   |-- hooks/               # Shared React hooks
|   |-- lib/                 # API client, socket, query client, utilities
|   `-- store/               # Zustand stores
`-- design.md                # Design system notes and UI direction
```

## Getting started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- OAuth credentials for Google/GitHub if testing real login flows
- R2/S3-compatible storage credentials if testing uploads

### 1. Clone the repository

```bash
git clone <repository-url>
cd TeamPoint
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment variables

Create environment files for both apps.

```bash
backend/.env
frontend/.env.local
```

Frontend variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

Backend variables include database, auth, OAuth, email, storage, analytics, and
AI credentials. The backend validates required variables in
`backend/src/config/env.ts`.

<details>
<summary>Backend environment checklist</summary>

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

DEV_AUTH_SECRET=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=

GOOGLE_LOGIN_CLIENT_ID=
GOOGLE_LOGIN_CLIENT_SECRET=
GOOGLE_LOGIN_CALLBACK_URL=
GITHUB_LOGIN_CLIENT_ID=
GITHUB_LOGIN_CLIENT_SECRET=
GITHUB_LOGIN_CALLBACK_URL=

GOOGLE_INTEGRATION_CLIENT_ID=
GOOGLE_INTEGRATION_CLIENT_SECRET=
GOOGLE_INTEGRATION_CALLBACK_URL=

EMAIL_HOST=
EMAIL_PORT=
BREVO_SMTP_USER=
BREVO_SMTP_PASS=
EMAIL_FROM=

STORAGE_PROVIDER=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET_NAME=
R2_AVATAR_BUCKET_NAME=
R2_TOKEN_VALUE=
R2_AVATARS_PUBLIC_BASE_URL=

GITHUB_PAT=
GITHUB_OWNER=
GITHUB_REPO=

OPENAI_API_KEY=
DISCORD_ALERT_WEBHOOK_URL=
POSTHOG_PROJECT_TOKEN=

ENABLE_RATE_LIMIT=true
GLOBAL_RATE_LIMIT=100
AUTH_RATE_LIMIT=5
UPLOAD_RATE_LIMIT=30
API_RATE_LIMIT=60
INTEGRATION_RATE_LIMIT=20
REFRESH_TOKEN_RATE_LIMIT=10
```

</details>

### 4. Prepare the database

```bash
cd backend
npx prisma migrate dev
npm run seed
```

### 5. Run the apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open the frontend at:

```text
http://localhost:3000
```

## Available scripts

### Frontend

| Command                | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the Next.js dev server.         |
| `npm run build`        | Build the frontend for production.    |
| `npm run start`        | Start the production frontend server. |
| `npm run lint`         | Run ESLint.                           |
| `npm run format:check` | Check formatting with Prettier.       |
| `npm run format:fix`   | Format files with Prettier.           |

### Backend

| Command                    | Purpose                               |
| -------------------------- | ------------------------------------- |
| `npm run dev`              | Start the API with `tsx watch`.       |
| `npm run dist`             | Compile TypeScript.                   |
| `npm run start`            | Start the compiled production server. |
| `npm run seed`             | Seed development data.                |
| `npm run test`             | Run the Jest test suite.              |
| `npm run test:unit`        | Run unit tests.                       |
| `npm run test:integration` | Run integration tests.                |
| `npm run lint`             | Run ESLint.                           |
| `npm run format:check`     | Check formatting with Prettier.       |

## Project status

TeamPoint is currently in beta early access.

Current focus:

- Polish the landing page and onboarding flow.
- Make the task, discussion, and meeting loop feel natural.
- Improve workspace/project setup for first-time teams.
- Explore AI features for meeting notes, planning, and action item creation.

## Roadmap

- AI-assisted meeting summaries and task creation.
- Better imports/migration from existing tools.
- Deeper calendar and GitHub integrations.
- More dashboard and workload insights.
- Production-ready documentation and deployment guide.

## Contributing

This is currently a personal portfolio/product project. If you are exploring the
codebase, start with the feature folders and keep changes scoped to the module
you are working on.

Recommended workflow:

1. Create a feature branch.
2. Run lint/tests for the area you changed.
3. Keep UI changes consistent with the existing Tailwind/shadcn patterns.
4. Open a pull request with screenshots for frontend changes.

## License

This project is currently unlicensed and marked as `UNLICENSED` in the backend
package metadata. Do not reuse or redistribute without permission.

---

<div align="center">

Built for small teams that want less tool management and more finished work.

</div>
