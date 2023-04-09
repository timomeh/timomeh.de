import PostsPage from './page/[page]/page'

// This file wouldn't be necessary if rewrites would be working:
// https://github.com/vercel/next.js/issues/40549

export const dynamic = 'force-static'

export default function Posts() {
  // @ts-expect-error Server Component
  return <PostsPage params={{ page: '1' }} />
}

export const metadata = {
  title: 'Posts',
  description:
    'About software development and other thoughts I wanted to elaborate on.',
  alternates: {
    types: {
      'application/atom+xml': '/posts/feed.atom',
      'application/rss+xml': '/posts/feed.rss',
      'application/feed+json': '/posts/feed.json',
    },
  },
}
