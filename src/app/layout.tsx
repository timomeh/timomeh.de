import '@/styles/globals.css'

import { IBM_Plex_Mono, Inter, Outfit } from 'next/font/google'
import localFont from 'next/font/local'
import Link from 'next/link'

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
  weight: ['400', '600'],
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
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth bg-[#1f1e1f] bg-[url('./grainy.svg')] text-white
      antialiased [font-feature-settings:'ss01'] ${pixeloid.variable}
      ${ibmPlexMono.variable} ${outfit.variable} ${inter.variable}`}
    >
      <body className="relative min-h-full">
        <div>
          {children}
          <footer className="mx-auto flex max-w-2xl justify-end px-4 py-10">
            <div className="font-pixel text-[9px] font-bold uppercase">
              <ul className="flex space-x-1">
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
    template: '%s | Timo Mämecke',
    default: 'Timo Mämecke – Web Development and feeling ways about stuff.',
  },
  authors: [{ name: 'Timo Mämecke', url: 'https://timomeh.de' }],
  publisher: 'Timo Mämecke',
  openGraph: {
    siteName: 'Timo Mämecke',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    types: {
      'application/atom+xml': '/offtopic/feed.atom',
      'application/rss+xml': '/offtopic/feed.rss',
      'application/feed+json': '/offtopic/feed.json',
    },
  },
}

export const viewport = {
  themeColor: '#D8B4FE',
}
