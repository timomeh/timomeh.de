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
ONBUILD ADD ./out/pnpm-cache.tar /
ONBUILD ADD ./out/next-cache.tar ./

# build with or without cache based on the CACHE build arg
FROM build-base-${CACHE} AS build
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build
# prepare cache artifacts for export
RUN tar -cf pnpm-cache.tar /pnpm/store && \
    tar -cf next-cache.tar .next

# export stage
FROM scratch AS export
COPY --from=build /app/next-cache.tar next-cache.tar
COPY --from=build /app/pnpm-cache.tar pnpm-cache.tar

# production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public

RUN mkdir .next && chown nextjs:nodejs .next
RUN mkdir .next/cache && chown nextjs:nodejs .next/cache

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js