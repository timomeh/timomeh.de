## [timomeh.de](https://timomeh.de)

Source Code of [timomeh.de](https://timomeh.de). It's built with Next.js, [Keystatic](https://keystatic.com/) as CMS, and Redis to cache and query content.

I wrote posts about [how I'd like my Blog to work](https://timomeh.de/posts/how-to-build-a-blog) and [how I implemented it](https://timomeh.de/posts/how-i-built-this-blog), although the implementation post is outdated and changed a lot.

See also:
- ["Take Care of Your Blog"](https://www.robinrendle.com/notes/take-care-of-your-blog-/) by Robin Rendle

## Implementation details

### Querying content

[Keystatic](https://keystatic.com/) allows me to edit and fetch content from a private GitHub repository. But you can only fetch content by its slug, and in order to filter posts, you'd need to fetch everything and filter it in code. That's why I store the content in a Redis cache with Redisearch, using [Dragonfly](https://dragonflydb.io/). It allows me to query, filter and paginate posts.

### Serving images

Images are stored in the private GitHub repository as well. To make them publicly accessible, I proxy and cache those images in a Next.js Route Handler.


## Stack

- [Next.js](https://nextjs.org/)
- self-hosted on a [Hetzner VPS](https://www.hetzner.com/cloud/) with [Coolify](https://coolify.io/)
- Cloudflare Proxy
- [Keystatic](https://keystatic.com/)
- Redis with [Dragonfly](https://dragonflydb.io/)
- [Umami](https://umami.is/)
- [Shiki](https://shiki.style/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) & [Argos CI](https://argos-ci.com)