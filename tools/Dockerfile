# syntax=docker.io/docker/dockerfile:1

FROM node:24.16.0-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Build app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    corepack enable pnpm && \
    SITE_URL="https://timomeh.de" pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown node:node .next

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next/cache

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER node
EXPOSE 3000

CMD ["node", "server.js"]
