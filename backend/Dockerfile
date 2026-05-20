# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Required for native packages
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /usr/src/app

# Required for Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built app
COPY --from=builder /usr/src/app/dist ./dist

# Copy Prisma schema
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose app port
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]