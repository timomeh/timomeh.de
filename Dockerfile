ARG CACHE=uncached

FROM node:20-alpine AS base

FROM base AS pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# build base without cache: nothing special
FROM pnpm as build-base-uncached
ONBUILD WORKDIR /app

# build base with cache: load cache
FROM pnpm as build-base-cached
ONBUILD WORKDIR /app
ONBUILD ADD ./out/node_modules-cache.tar .
ONBUILD ADD ./out/next-cache.tar ./

# build with or without cache based on the CACHE build arg
FROM build-base-${CACHE} AS builder
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build
# prepare cache artifacts for export
RUN tar -cvf node_modules.tar node_modules && \
    tar -cvf next-cache.tar .next/cache

# export stage
FROM scratch AS export
COPY --from=builder /app/next-cache.tar next-cache.tar
COPY --from=builder /app/node_modules.tar node_modules-cache.tar

# production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next && chown nextjs:nodejs .next
RUN mkdir .next/cache && chown nextjs:nodejs .next/cache

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js