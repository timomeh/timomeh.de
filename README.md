## [timomeh.de](https://timomeh.de)

Source code from [timomeh.de](https://timomeh.de). It's built with Next.js, [Keystatic](https://keystatic.com/) as CMS, and SQLite for caching and querying content.

I wrote posts about [how I'd like my blog to work](https://timomeh.de/posts/how-to-build-a-blog) and [how I implemented it](https://timomeh.de/posts/how-i-built-this-blog) – although this implementation post is outdated and has changed a lot. This README reflects the most up-to-date implementation.

See also:

- ["Take Care of Your Blog"](https://www.robinrendle.com/notes/take-care-of-your-blog-/) by Robin Rendle

## Getting Started

1. Fill in env variables
2. `pnpm db:push` to prepare database
3. `pnpm dev`
4. Visit https://localhost:3000/webhooks/nuke to populate database

## Implementation details

### Where do I store content?

All content, including images, is stored in a private GitHub repository. I use [Keystatic](https://keystatic.com/) as a CMS to manage this content. I enjoy the editing experience in a WYSIWYG editor in my browser, with support for drag-and-drop file uploads. Keeping the content repository private allows me to work on drafts in private.

### Storing content in SQLite

[Keystatic](https://keystatic.com/) only supports fetching content by its slug. Getting content based on other attributes (like tags) means you have to fetch all posts and filter them yourself. Caching in Next.js could fix that, but I'm a bit paranoid about hitting GitHub API Rate Limits. That's why I store the content in a SQLite cache. It allows me to query, filter and sort posts. Everything you need.

Whenever content in the private repository changes, GitHub triggers a webhook that updates the corresponding cache.

SQLite is only used as an ephemeral cache, so there is no potential of data loss.

### Serving images

Images are also stored in the private GitHub repository. To make them publicly accessible, I proxy and cache those images in a Next.js route handler.

Videos are simply uploaded to YouTube, and YouTube links in posts are automatically converted to embeds.

## Publish

- The `main` branch automatically builds a release candidate, runs e2e tests against it, publishes it to ghcr.io, and then triggers a docker pull on the server.
- Pull Requests are automatically built and e2e tested.
- todo: pull request previews would be nice. Coolify doesn't seem to support them with docker-image based apps right now.

## Stack

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
