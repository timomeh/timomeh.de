# syntax=docker.io/docker/dockerfile:1

FROM node:22-slim AS base

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

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache /app/data && \
    rm -rf /app/.next/cache/images /app/.next/cache/raw-content-images /app/data/db-data && \
    ln -s /data/images /app/.next/cache/images && \
    ln -s /data/raw-content-images /app/.next/cache/raw-content-images && \
    ln -s /data/db-data /app/data/db-data
RUN chown -h nextjs:nodejs /app/.next/cache/images /app/.next/cache/raw-content-images /app/data/db-data

VOLUME ["/data"]

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh","-lc","mkdir -p /data/images /data/raw-content-images /data/db-data && exec node server.js"]