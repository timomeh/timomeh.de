## [timomeh.de](https://timomeh.de)

Source Code for my site and blog under [timomeh.de](https://timomeh.de). It's built on top of GitHub Discussions with Next.js

I wrote posts about [how I'd like my Blog to work](https://timomeh.de/posts/how-to-build-a-blog) and [how I implemented it](https://timomeh.de/posts/how-i-built-this-blog), although the implementation post is outdated and changed a lot.

See also:
- ["Take Care of Your Blog"](https://www.robinrendle.com/notes/take-care-of-your-blog-/) by Robin Rendle

## Discussions

All posts are located in the Discussion's
[Post Category](https://github.com/timomeh/timomeh.de/discussions/categories/posts) or [Offtopic Category](https://github.com/timomeh/timomeh.de/discussions/categories/offtopic). Why 2 categories? Historical reasons, I wanted to differentiate between posts I put more time into, and just brain blurbs.

## Architecture

To improve working with caching and revalidation, I structured data fetching into a simple and systematic way:

- Some components represent a resource (like a post or a tag).
- Those components only get the resource's unique identifier as props – not the whole object.
- Each one of those components then fetches their data itself.

Using this structure, I can subscribe to GitHub's webhooks, and revalidate only the specific affected caches. This way a revalidation doesn't slow down the whole blog for a short while, but only the affected changes.

## Stack

- [Next.js](https://nextjs.org/)
- [GitHub Discussions](https://github.com/timomeh/timomeh.de/discussions) / Octokit
- [Shiki](https://shiki.style/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) & [Argos CI](https://argos-ci.com)