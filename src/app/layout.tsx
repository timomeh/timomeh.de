import '@/styles/globals.css'

import { IBM_Plex_Mono, Inter, Outfit } from 'next/font/google'
import localFont from 'next/font/local'

import { ProgressBar } from '@/comps/progress-bar'
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
}

export const dynamic = 'force-static'

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth bg-[#1f1e1f] bg-grainy text-white ${pixeloid.variable}
      ${ibmPlexMono.variable} ${outfit.variable} ${inter.variable}`}
    >
      <head>
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            src="https://peekaboo.timo.wtf/script.js"
            data-website-id="ecbed209-2cd5-438d-ac1d-e1c983f0e8ec"
          />
        )}
      </head>
      <body className="group/body relative">
        <div className="page-grid grid h-full place-items-stretch items-start *:min-w-0">
          <header className="relative h-0 [grid-area:main] group-has-[.signal-hide-header]/body:hidden">
            <div className="relative z-10">
              <Header />
            </div>
          </header>
          {children}
          <ProgressBar />
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
  robots: {
    'max-image-preview': 'large',
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
