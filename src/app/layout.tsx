import '@/styles/globals.css'

import { IBM_Plex_Mono, Inter, Outfit } from 'next/font/google'
import localFont from 'next/font/local'
import Link from 'next/link'
import NextTopLoader from 'nextjs-toploader'

import { Header } from '@/comps/header'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin-ext'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
})

const pixeloid = localFont({
  src: [
    { path: '../styles/Pixeloid.ttf', weight: '400', style: 'normal' },
    { path: '../styles/PixeloidBold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-pixeloid',
})

type Props = {
  children: React.ReactNode
  backdrop: React.ReactNode
  nextPost: React.ReactNode
  prevPost: React.ReactNode
}

export default function RootLayout({
  children,
  backdrop,
  nextPost,
  prevPost,
}: Props) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth bg-[#1f1e1f] bg-grainy text-white ${pixeloid.variable}
      ${ibmPlexMono.variable} ${outfit.variable} ${inter.variable}`}
    >
      <body className="relative">
        <NextTopLoader
          showSpinner={false}
          shadow={false}
          template={`<div class="bar site-progress-bar" role="bar"><div class="inner"></div></div>`}
        />
        {nextPost}
        <div className="flex min-h-dvh flex-col">
          <header className="relative w-full">
            <div className="relative z-10">
              <Header />
            </div>
            {backdrop}
          </header>
          <main className="relative z-30 w-full flex-1">{children}</main>
          <footer className="relative z-30 mx-auto flex w-full max-w-2xl justify-end px-4 py-10">
            <div
              className="font-pixel text-[9px] font-bold uppercase antialiased
                [font-feature-settings:'ss01']"
            >
              <ul className="flex space-x-1">
                <li>
                  <Link
                    href="/feeds"
                    className="text-white/30 transition-colors hover:text-white/60"
                  >
                    Feeds
                  </Link>
                </li>
                <li className="text-white/30">/</li>
                <li>
                  <Link
                    href="/impressum"
                    className="text-white/30 transition-colors hover:text-white/60"
                  >
                    Imprint
                  </Link>
                </li>
                <li className="text-white/30">/</li>
                <li>
                  <Link
                    href="/datenschutz"
                    className="text-white/30 transition-colors hover:text-white/60"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </footer>
        </div>
        {prevPost}
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase:
    process.env.NODE_ENV === 'production'
      ? new URL('https://timomeh.de')
      : new URL('http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
  title: {
    template: '%s | timomeh.de',
    default: 'timomeh.de',
  },
  authors: [{ name: 'Timo Mämecke', url: 'https://timomeh.de' }],
  publisher: 'Timo Mämecke',
  openGraph: {
    siteName: 'timomeh.de',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    types: {
      'application/atom+xml': '/posts/feed.atom',
      'application/rss+xml': '/posts/feed.rss',
      'application/feed+json': '/posts/feed.json',
    },
  },
}

export const viewport = {
  themeColor: '#1C1C1C',
}
