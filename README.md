## [timomeh.de](https://timomeh.de)

Source code from [timomeh.de](https://timomeh.de). Stack:

- Next.js
- Content stored in a separate (private) GitHub Repo
- [Vla](https://vla.run) as data layer
- [Keystatic](https://keystatic.com/) as CMS
- [Drizzle](https://orm.drizzle.team) with Postgres for caching and querying the
  content from GitHub

Is this a bit overkill for a blog? Probably. Is it fun? Absolutely.

## Implementation details

### Where do I store content?

All posts and pages, including images, are stored in a private GitHub repository
as MDX. I use [Keystatic](https://keystatic.com/) as a CMS to manage this
content. I enjoy the editing experience in a WYSIWYG editor in my browser, with
support for drag-and-drop file uploads. Keeping the content repository private
allows me to work on drafts in private.

### Why Postgres?

I have a requirement for myself: the blog should not rebuild when content
changes. When I fix a typo or publish a post, it should be available
immediately, not after a few minutes.

[Keystatic](https://keystatic.com/) has an API client to fetch content from
GitHub dynamically. But it only supports fetching a whole collection or a single
entry by it slug. No filtering, no pagination, no joins, no sort. You have to do
that in JavaScript. This will result in a lot of requests to the GitHub API. And
while a fetch cache could fix that, I could still hit the GitHub API Rate
Limits.

That's why I additionally store the content in Postgres. It's basically a cache.
The database could be wiped and I can recreate it from the content in GitHub.
And whenever content in the private repository changes, GitHub will trigger a
webhook that updates the corresponding caches.

### Serving images

Images are also stored in the private GitHub repository. To make them publicly
accessible, I have a private [reverse proxy](tools/github-private-reverse-proxy)
to fetch images from the private repo, with a public
[imgproxy](https://imgproxy.net/) in front of it for image optimization.

Videos are simply uploaded to YouTube, and YouTube links in posts are
automatically converted to embeds.

## Development

You need mise and docker with docker compose. Docker is used for additional
services (like the private content proxy and imgproxy).

1. Copy `.env` to `.env.local`, fill in missing values as necessary
2. `pnpm dev` will start the next dev server and docker containers (db, proxies)
3. `pnpm db:migrate` to prepare the database
4. Visit https://localhost:3000/webhooks/nuke to populate database

### Docker Logs

To view the logs of docker services running in the background:

```sh
pnpm dev:logs
```

### Inspect Postgres

You can use Drizzle Kit Studio to work with the postgres db.

```sh
pnpm db:studio
```

## Publish

Pushing to the `main` brach automatically triggers a new release:

- builds a new docker image
- runs e2e tests against it
- publishes the image it to ghcr.io
- releases the image to be deployed
- executes a database migration job

## Tech & Libraries used

This is total overkill and I do it because it's fun. You might not need what I
used:

- [Next.js](https://nextjs.org/)
- [Vla](https://vla.run/)
- Docker & docker compose
- Cloudflare CDN
- [imgproxy](https://imgproxy.net/) for image optimization
- [Keystatic](https://keystatic.com/) as CMS
- Postgres and [Drizzle](https://orm.drizzle.team/)
- [Shiki](https://shiki.style/)
- [mdx](https://mdxjs.com/packages/mdx) with cached rendered output
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) & [Argos CI](https://argos-ci.com)
- [LogLayer](https://loglayer.dev/)
