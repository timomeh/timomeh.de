import '@/styles/main.css'

import { Viewport } from 'next'
import { Bitter, IBM_Plex_Mono, Inter } from 'next/font/google'
import React from 'react'

import { PrevPathProvider } from '@/comps/prev-path'
import { ProgressBarProvider } from '@/comps/progress-bar'
import { ThemeSwitchScript } from '@/comps/theme-switch-script'
import { config } from '@/config'

import { KeyboardNavLink } from '../../comps/keyboard-nav-link'
import { ResponsiveSidebar } from './responsive-sidebar'

type Props = {
  children: React.ReactNode
  header: React.ReactNode
  aside: React.ReactNode
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const bitter = Bitter({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-bitter',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
})

export default async function RootLayout({ children, header, aside }: Props) {
  return (
    <html
      lang="en"
      data-theme="system"
      suppressHydrationWarning
      className={`group/root motion-safe:**:focus-visible:animate-outline-bounce page-bg h-full
        text-gray-900 scheme-light transition-colors duration-300
        **:focus-visible:rounded-xs **:focus-visible:outline-2
        **:focus-visible:outline-offset-4 **:focus-visible:outline-[#a18570]
        dark:text-white dark:scheme-dark dark:**:focus-visible:outline-emerald-300
        ${ibmPlexMono.variable} ${bitter.variable} ${inter.variable}`}
    >
      <head>
        {config.umamiWebsiteId && (
          <script
            defer
            src="https://peekaboo.timo.wtf/script.js"
            data-website-id={config.umamiWebsiteId}
          />
        )}
        <ThemeSwitchScript />
        <link href="https://mastodon.social/@timomeh" rel="me" />
      </head>
      <body className="group/body relative">
        <ProgressBarProvider>
          <PrevPathProvider>
            <div className="relative">
              <KeyboardNavLink href="#main">Skip to main</KeyboardNavLink>
              {header}
              <div
                className="mx-auto w-full gap-2 px-2 sm:grid sm:w-fit sm:max-w-full
                  sm:grid-cols-[minmax(0,700px)_auto]"
                id="main"
              >
                <div className="relative order-2">
                  <KeyboardNavLink href="#content" className="max-sm:hidden">
                    Skip to content
                  </KeyboardNavLink>
                  <div role="navigation" id="aside" className="sm:h-full">
                    <ResponsiveSidebar>{aside}</ResponsiveSidebar>
                  </div>
                </div>
                <div className="relative order-1">
                  <KeyboardNavLink href="#aside" className="max-sm:hidden">
                    Jump to navigation
                  </KeyboardNavLink>
                  <div id="content" className="h-full">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </PrevPathProvider>
        </ProgressBarProvider>
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
