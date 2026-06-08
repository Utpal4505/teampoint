# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

# Pehle saara source copy karo
COPY . .

# Phir prisma generate karo (ab src/generated/prisma/ sahi jagah banega)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Ab build karo
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# ✅ Folder pehle banao, phir copy karo
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/prisma
RUN cp -r src/generated/prisma dist/generated/prisma

# Stage 2: Production
FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Compiled dist copy karo (dist/generated/prisma bhi iske andar hai)
COPY --from=builder /usr/src/app/dist ./dist

# Prisma 7 runtime files
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "dist/index.js"]