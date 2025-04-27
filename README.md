## [timomeh.de](https://timomeh.de)

Source code from [timomeh.de](https://timomeh.de). Stack:

- Next.js
- Content stored in a separate (private) GitHub Repo
- [Keystatic](https://keystatic.com/) as CMS
- [Drizzle](https://orm.drizzle.team) with SQLite for caching and querying the content from GitHub
- Docker Compose to build, deploy and migrate

Is this a bit overkill for a blog? Probably. Is it fun? Absolutely.

## Implementation details

### Where do I store content?

All posts and pages, including images, are stored in a private GitHub repository as MDX. I use [Keystatic](https://keystatic.com/) as a CMS to manage this content. I enjoy the editing experience in a WYSIWYG editor in my browser, with support for drag-and-drop file uploads. Keeping the content repository private allows me to work on drafts in private.

### Why cache in SQLite?

[Keystatic](https://keystatic.com/) only supports fetching content by a slug or fetching everything. No filtering, no joins, no sort—you have to do that in JavaScript. This can result in a bunch of requests to the GitHub API.

A fetch cache could fix that, but _in theory_ I could still hit the GitHub API Rate Limits—especially when dependabot opens or rebases a bunch of PRs, and E2E tests constantly fetch new data from GitHub.

That's why I cache it. Caching it in a SQL database additionally gives me filters, joins, sort. Whenever content in the private repository changes, GitHub triggers a webhook that updates the corresponding caches.

### Serving images

Images are also stored in the private GitHub repository. To make them publicly accessible, I proxy and cache those images in a Next.js route handler.

Videos are simply uploaded to YouTube, and YouTube links in posts are automatically converted to embeds.

## Getting Started

1. Fill in env variables
2. `pnpm db:push` to prepare database
4. `pnpm dev`
5. Visit https://localhost:3000/webhooks/nuke to populate database

## Publish

- The `main` branch automatically builds a release candidate, runs e2e tests against it, publishes it to ghcr.io, and then triggers a docker pull on the server, which then also executes any pending database migrations.
- Pull Requests are automatically built and e2e tested.

## Tech & Libraries used

- [Next.js](https://nextjs.org/)
- self-hosted on a [Hetzner VPS](https://www.hetzner.com/cloud/) with [Coolify](https://coolify.io/)
- Cloudflare Proxy
- [Keystatic](https://keystatic.com/)
- SQLite and [Drizzle](https://orm.drizzle.team/)
- [Umami](https://umami.is/)
- [Shiki](https://shiki.style/)
- [mdx](https://mdxjs.com/packages/mdx) with cached rendered output
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) & [Argos CI](https://argos-ci.com)
- [LogLayer](https://loglayer.dev/)
