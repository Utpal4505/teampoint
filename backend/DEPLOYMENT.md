# TeamPoint Backend Docker Deployment Guide

This guide explains how to build, run, and manage the Docker container for the TeamPoint backend.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- A running PostgreSQL database (either local, in Docker, or hosted like RDS/Supabase/Neon).

---

## 1. Build the Docker Image

Navigate to the `backend` directory and build the Docker image:

```bash
docker build -t teampoint-backend .
```

---

## 2. Running the Container

The backend expects several environment variables (see `.env.example`). You can pass them using an env file or command-line flags.

### Option A: Using an Environment File

Make sure you have a `.env.production` file setup in your host directory, then run:

```bash
docker run -d \
  --name teampoint-backend-app \
  -p 8000:8000 \
  --env-file .env.production \
  teampoint-backend
```

### Option B: Passing Individual Variables

```bash
docker run -d \
  --name teampoint-backend-app \
  -p 8000:8000 \
  -e PORT=8000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public" \
  -e ACCESS_TOKEN_SECRET="your-access-token-secret" \
  -e REFRESH_TOKEN_SECRET="your-refresh-token-secret" \
  teampoint-backend
```

---

## 3. Running Database Migrations

Since Prisma is used, you must apply database migrations before running the backend if the database is new or updated. 

You can run migrations using a temporary container linked to your database:

```bash
docker run --rm \
  --env-file .env.production \
  teampoint-backend \
  npx prisma migrate deploy
```

If you also want to seed the database with initial developer/mock data:

```bash
docker run --rm \
  --env-file .env.production \
  teampoint-backend \
  npm run seed
```

---

## 4. Docker Compose Setup (Optional)

If you want to run the backend along with a PostgreSQL database locally for testing, you can create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: teampoint-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: teampoint
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: teampoint-backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
      - DATABASE_URL=postgresql://postgres:mysecretpassword@postgres:5432/teampoint?schema=public
      - NODE_ENV=production
      # Add other environment variables from .env here
    depends_on:
      - postgres

volumes:
  postgres_data:
```
