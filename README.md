## [timomeh.de](https://timomeh.de)

Source code from [timomeh.de](https://timomeh.de). It's built with Next.js, [Keystatic](https://keystatic.com/) as CMS, and Redis for caching and querying content.

I wrote posts about [how I'd like my blog to work](https://timomeh.de/posts/how-to-build-a-blog) and [how I implemented it](https://timomeh.de/posts/how-i-built-this-blog) – although this implementation post is outdated and has changed a lot. This README reflects the most up-to-date implementation.

See also:

- ["Take Care of Your Blog"](https://www.robinrendle.com/notes/take-care-of-your-blog-/) by Robin Rendle

## Implementation details

### Where do I store content?

All content, including images, is stored in a private GitHub repository. I use [Keystatic](https://keystatic.com/) as a CMS to manage this content. I enjoy the editing experience in a WYSIWYG editor in my browser, with support for drag-and-drop file uploads. Keeping the content repository private allows me to work on drafts in private.

### Storing content in Redis

[Keystatic](https://keystatic.com/) only supports fetching content by its slug. Getting content based on other attributes (like tags) means you have to fetch all posts and filter them yourself. That's why I store the content in a Redis cache with Redisearch, specifically using [Dragonfly](https://dragonflydb.io/), which is much nicer to deploy. It allows me to query, filter, sort and paginate posts. Everything you need.

Whenever content in the private repository changes, GitHub triggers a webhook that updates the corresponding cache.

Redis is only used as an ephemeral cache, so there is no potential of data loss.

### Serving images

Images are also stored in the private GitHub repository. To make them publicly accessible, I proxy and cache those images in a Next.js route handler.

Videos are simply uploaded to YouTube, and YouTube links in posts are automatically converted to embeds.

## Stack

- [Next.js](https://nextjs.org/)
- self-hosted on a [Hetzner VPS](https://www.hetzner.com/cloud/) with [Coolify](https://coolify.io/)
- Cloudflare Proxy
- [Keystatic](https://keystatic.com/)
- Redis with [Dragonfly](https://dragonflydb.io/)
- [Umami](https://umami.is/)
- [Shiki](https://shiki.style/)
- [mdx](https://mdxjs.com/packages/mdx)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) & [Argos CI](https://argos-ci.com)
