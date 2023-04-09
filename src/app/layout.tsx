import Link from 'next/link'

import { BalancerProvider } from '@/components/BalancerProvider'

import { Logo } from '@/components/Logo'
import { StoreProvider } from '@/lib/store'

import '@/styles/globals.css'
import '@fontsource/ibm-plex-mono/latin-ext.css'
import '@fontsource/inter/latin.css'
import '@fontsource/outfit/latin.css'
import { Navigation } from '@/components/Navigation'

type Props = {
  children: React.ReactNode
}

export const dynamic = 'force-static'

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full relative antialiased [font-feature-settings:'ss01'] bg-[#1F1E20] text-white">
        <StoreProvider>
          <div className="absolute inset-0 [background-image:var(--grainy)] [background-size:300px] filter contrast-[2000%] brightness-[50%] mix-blend-multiply z-[-1] opacity-70" />
          <BalancerProvider>
            <div className="meh-grid">
              {children}
              <header className="meh-header">
                <div className="flex pl-4 lg:pl-0 lg:justify-end pt-4 lg:pt-8 pb-6">
                  <Link href="/">
                    <Logo className="h-10 w-auto" />
                  </Link>
                </div>
              </header>
              <Navigation />
              <footer className="meh-footer">
                <div className="flex justify-end text-[11px] uppercase font-bold space-x-1">
                  <Link
                    href="/impressum"
                    className="opacity-30 hover:opacity-60 transition-opacity"
                  >
                    Impressum
                  </Link>
                  <div className="opacity-30">&</div>
                  <Link
                    href="/datenschutz"
                    className="opacity-30 hover:opacity-60 transition-opacity"
                  >
                    Datenschutz
                  </Link>
                </div>
              </footer>
            </div>
          </BalancerProvider>
        </StoreProvider>
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
  themeColor: '#141315',
  title: {
    template: '%s | Timo Mämecke',
    default: 'Timo Mämecke – Web Development and feeling ways about stuff.',
  },
  authors: [{ name: 'Timo Mämecke', url: 'https://timomeh.de' }],
  publisher: 'Timo Mämecke',
  openGraph: {
    siteName: 'Timo Mämecke',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/assets/og-image/static/default.png',
        height: 630,
        width: 1200,
      },
    ],
  },
  alternates: {
    types: {
      'application/atom+xml': '/offtopic/feed.atom',
      'application/rss+xml': '/offtopic/feed.rss',
      'application/feed+json': '/offtopic/feed.json',
    },
  },
}
