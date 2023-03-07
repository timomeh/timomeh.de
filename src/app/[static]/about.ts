import { Metadata } from 'next'

export const body = `
# Hi, I’m Timo 👋

I’m Timo Mämecke, online sometimes known as [@timomeh](https://mastodon.social/@timomeh).
I am a Software Engineer from Germany, and Frontend Engineering Lead at [Gigs](https://gigs.com/).

I have a past of building Blogs and wanting to publish content, but barely writing anything.
[I found the issue](https://timomeh.de/posts/how-to-build-a-blog) and this
version of my blog solves this issue.

If you want to reach out to me, you can do so via [Mastodon](https://mastodon.social/@timomeh), [GitHub](https://github.com/timomeh/timomeh.de/discussions/new?category=ask-me) or [Email](mailto:hello@timomeh.de).
`

export const head: Metadata = {
  title: 'Hi, I’m Timo 👋',
  openGraph: {
    images: [
      {
        url: 'https://timomeh.de/assets/og-image/static/about.png',
        height: 630,
        width: 1200,
      },
    ],
  },
}
