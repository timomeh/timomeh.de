import '@/styles/globals.css'

import { IBM_Plex_Mono, Inter, Outfit } from 'next/font/google'
import localFont from 'next/font/local'

import { ProgressBar } from '@/comps/progress-bar'
import { PrevPathProvider } from '@/comps/prev-path'
import { config } from '@/config'

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
    { path: '../../styles/Pixeloid.ttf', weight: '400', style: 'normal' },
    { path: '../../styles/PixeloidBold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-pixeloid',
})

export const fetchCache = 'default-cache'

type Props = {
  children: React.ReactNode
  header: React.ReactNode
  topscroll: React.ReactNode
  bottomscroll: React.ReactNode
}

export default function RootLayout({
  children,
  header,
  topscroll,
  bottomscroll,
}: Props) {
  return (
    <html
      lang="en"
      className={`motion-safe:[&_*:focus-visible]:animate-outline-bounce h-full bg-[#1f1e1f]
        bg-grainy text-white [&_*:focus-visible]:rounded-sm [&_*:focus-visible]:outline
        [&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-offset-4
        [&_*:focus-visible]:outline-emerald-300 ${pixeloid.variable}
        ${ibmPlexMono.variable} ${outfit.variable} ${inter.variable}`}
    >
      <head>
        {config.umamiWebsiteId && (
          <script
            defer
            src="https://peekaboo.timo.wtf/script.js"
            data-website-id={config.umamiWebsiteId}
          />
        )}
      </head>
      <body className="group/body relative">
        <PrevPathProvider>
          {topscroll}
          <div className="relative flex min-h-dvh flex-col self-start *:w-full">
            {header}
            {children}
          </div>
          {bottomscroll}
          <ProgressBar />
        </PrevPathProvider>
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL(config.siteUrl),
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
