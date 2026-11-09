# [timomeh.de](https://timomeh.de)

Source code for [timomeh.de](https://timomeh.de). Stack:

- [Eleventy](https://www.11ty.dev/)
- Content stored in a separate (private) GitHub Repo
- no compilers, no bundlers

I'm sick of taming dependencies, security issues, and upgrade paths to maintain a blog. So I'm using plain CSS, vanilla JavaScript, and only a few dependencies.

## Development

- Requires Node.js (`mise install`)
- Requires the content repository to be checked out at `../timomeh.de-content`

```sh
npm install
npm start
```

## Deployment

This is a static site, but I don't want to wait for a whole CI run after I fix a typo. Waiting for a worker, installing dependencies, and doing a fresh build... it all takes way too long just to fix a typo. I want it to be done in a second, not 10 seconds.

`deployer/` is a small service that listenes to GitHub webhooks from the content repository, rebuilds the site, and uploads it using [`git-pages`](https://codeberg.org/git-pages/git-pages).

### Getting rid of old, cached images

To speed up the eleventy build, images are cached. This means that old, unused images are still cached and will be available.

To get rid of them, trigger a fresh build:

```sh
/bin/sh /app/deployer/request-build.sh --fresh
```

### Deploy manually

Make sure the checked out content repo is up-to-date.

```sh
rm -rf _site
npm run build
SITE_URL=https://timomeh.de GIT_PAGES_PASSWORD=... bash scripts/deploy.sh
```
