FROM almir/webhook:2.8.3 AS webhook
FROM codeberg.org/git-pages/git-pages-cli:1.13.1 AS git-pages

FROM node:26-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git tini util-linux \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=webhook /usr/local/bin/webhook /usr/local/bin/webhook
COPY --from=git-pages /bin/git-pages-cli /usr/local/bin/git-pages-cli
COPY eleventy.config.js ./
COPY lib ./lib
COPY src ./src
COPY deployer ./deployer
RUN chmod +x /app/deployer/git-askpass.sh

USER node
EXPOSE 9000
ENTRYPOINT ["/usr/bin/tini", "-g", "--", "/bin/sh", "/app/deployer/start.sh"]
