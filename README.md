## [timomeh.de](https://timomeh.de)

Source code from [timomeh.de](https://timomeh.de). Stack:

- Next.js
- Content stored in a separate (private) GitHub Repo
- [Keystatic](https://keystatic.com/) as CMS
- [Drizzle](https://orm.drizzle.team) with SQLite for caching and querying the content from GitHub
- hosted on [Railway](https://railway.com/) 🚞

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
3. `pnpm dev`
4. Visit https://localhost:3000/webhooks/nuke to populate database

## Publish

Pushing to the `main` brach automatically triggers a new release:

- it builds a new docker image as release candidate
- runs e2e tests against it
- publishes the release it to ghcr.io
- redeploys the Railway service
- executes a database migration container

## Tech & Libraries used

- [Next.js](https://nextjs.org/)
- hosted on [Railway](https://railway.com/)
- Cloudflare Proxy
- [Keystatic](https://keystatic.com/)
- SQLite and [Drizzle](https://orm.drizzle.team/)
- a libSQL server on production, so I can connect to it to migrate the database
- [Umami](https://umami.is/)
- [Shiki](https://shiki.style/)
- [mdx](https://mdxjs.com/packages/mdx) with cached rendered output
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) & [Argos CI](https://argos-ci.com)
- [LogLayer](https://loglayer.dev/)
