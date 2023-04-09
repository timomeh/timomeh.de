import OfftopicPage from './page/[page]/page'

// This file wouldn't be necessary if rewrites would be working:
// https://github.com/vercel/next.js/issues/40549

export default function Home() {
  // @ts-expect-error Server Component
  return <OfftopicPage params={{ page: '1' }} />
}

export const metadata = {
  description: "I think things and just write 'em down.",
  alternates: {
    canonical: 'https://timomeh.de/',
    types: {
      'application/atom+xml': '/offtopic/feed.atom',
      'application/rss+xml': '/offtopic/feed.rss',
      'application/feed+json': '/offtopic/feed.json',
    },
  },
}
