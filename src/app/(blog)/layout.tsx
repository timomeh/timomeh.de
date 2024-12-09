import '@/styles/globals.css'

import { IBM_Plex_Mono, Inter, Outfit } from 'next/font/google'
import localFont from 'next/font/local'

import { ProgressBar } from '@/comps/progress-bar'
import { PrevPathProvider } from '@/comps/prev-path'
import { config } from '@/config'
import React from 'react'
import { Viewport } from 'next'

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
  weight: ['400', '600', '700'],
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

type Props = {
  children: React.ReactNode
  header: React.ReactNode
  topscroll: React.ReactNode
  bottomscroll: React.ReactNode
}

export default async function RootLayout({
  children,
  header,
  topscroll,
  bottomscroll,
}: Props) {
  return (
    <html
      lang="en"
      data-theme="system"
      suppressHydrationWarning
      className={`group/root h-full bg-[#f2f1f0] bg-grainy-light bg-[length:200px_200px]
        text-gray-900 transition-colors duration-300 dark:bg-[#141314] dark:bg-grainy
        dark:text-white [&_*:focus-visible]:rounded-sm [&_*:focus-visible]:outline
        [&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-offset-4
        [&_*:focus-visible]:outline-[#a18570]
        motion-safe:[&_*:focus-visible]:animate-outline-bounce
        dark:[&_*:focus-visible]:outline-emerald-300 ${pixeloid.variable}
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
        <script>
          {`(function () {
              let theme = localStorage.getItem('theme');
              const supp = ['dark','light'];
              theme = supp.includes(theme) ? theme : null;
              document.documentElement.setAttribute('data-theme', theme || 'system');
          })();`}
        </script>
        <link href="https://mastodon.social/@timomeh" rel="me" />
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

export const viewport: Viewport = {
  themeColor: '#1C1C1C',
  colorScheme: 'light dark',
}
