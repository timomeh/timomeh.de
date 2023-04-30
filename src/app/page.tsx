import OfftopicPage from './offtopic/page/[page]/page'

// This file wouldn't be necessary if rewrites would be working:
// https://github.com/vercel/next.js/issues/40549

export const dynamic = 'force-static'

export default function Home() {
  // @ts-expect-error Server Component
  return <OfftopicPage params={{ page: '1' }} />
}

export const metadata = {
  description: "I think things and just write 'em down.",
  alternates: {
    canonical: 'https://timomeh.de/',
  },
}
