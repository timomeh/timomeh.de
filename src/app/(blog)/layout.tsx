import '@/styles/main.css'
import type { Metadata, Viewport } from 'next'
import { Bitter, IBM_Plex_Mono, Inter } from 'next/font/google'
import Script from 'next/script'
import type React from 'react'

import { PrevPathProvider } from '@/comps/prev-path'
import '@/data/kernel'
import { ProgressBarProvider } from '@/comps/progress-bar'
import { TooltipInit } from '@/comps/tooltip-init'
import { env, getEnv } from '@/env'

import { KeyboardNavLink } from '../../comps/keyboard-nav-link'
import { SiteHeader } from './site-header'

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

const fonts = `${ibmPlexMono.variable} ${bitter.variable} ${inter.variable}`

type Props = {
  children: React.ReactNode
  kicker: React.ReactNode
  backdrop: React.ReactNode
}

export default async function RootLayout({
  children,
  kicker,
  backdrop,
}: Props) {
  return (
    <html lang="en" data-theme="system" suppressHydrationWarning className={`
      group/root
      motion-safe:**:focus-visible:animate-outline-bounce
      page-bg h-full scroll-pt-14 text-gray-900 scheme-light transition-colors
      duration-300 **:focus-visible:rounded-xs
      **:focus-visible:outline-2 **:focus-visible:outline-offset-4
      **:focus-visible:outline-[#a18570] dark:text-white
      dark:scheme-dark
      dark:**:focus-visible:outline-emerald-300
      ${fonts}
    `}>
      <head>
        <meta
          name="theme-color"
          content="#E8E7E4"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0D0D0B"
          media="(prefers-color-scheme: dark)"
        />
        {env.UMAMI_PUBLIC_URL && env.UMAMI_WEBSITE_ID && (
          <script
            defer
            src={`${env.UMAMI_PUBLIC_URL}/script.js`}
            data-website-id={env.UMAMI_WEBSITE_ID}
            data-performance="true"
          />
        )}
        <Script
          id="env-vars"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function () {
              window.__timomeh_env = {
                CONTENT_PROXY_PRIVATE_URL: ${JSON.stringify(env.CONTENT_PROXY_PRIVATE_URL)},
                IMAGE_PROXY_PUBLIC_URL: ${JSON.stringify(env.IMAGE_PROXY_PUBLIC_URL)},
                IMAGE_PROXY_PRIVATE_URL: ${JSON.stringify(env.IMAGE_PROXY_PRIVATE_URL)},
                SITE_PUBLIC_URL: ${JSON.stringify(env.SITE_PUBLIC_URL)},
                SITE_PRIVATE_URL: ${JSON.stringify(env.SITE_PRIVATE_URL)},
                CMS_REPO: ${JSON.stringify(env.CMS_REPO)},
                UMAMI_PUBLIC_URL: ${JSON.stringify(env.UMAMI_PUBLIC_URL)},
                UMAMI_WEBSITE_ID: ${JSON.stringify(env.UMAMI_WEBSITE_ID)},
              };
            })();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
              let theme = localStorage.getItem('theme');
              const supp = ['dark', 'light'];
              theme = supp.includes(theme) ? theme : null;
              document.documentElement.setAttribute('data-theme', theme || 'system');
              if (theme) {
                const color = theme === 'light' ? '#E8E7E4' : '#0D0D0B';
                document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());
                const meta = document.createElement('meta');
                meta.name = 'theme-color';
                meta.content = color;
                document.head.appendChild(meta);
              }
            })();`,
          }}
        />
        <link href="https://mastodon.social/@timomeh" rel="me" />
      </head>
      <body className="group/body relative">
        <ProgressBarProvider>
          <PrevPathProvider>
            <div className="relative">
              <KeyboardNavLink href="#nav">
                Skip header to navigation
              </KeyboardNavLink>
              <SiteHeader kicker={kicker} backdrop={backdrop} />
              {children}
            </div>
          </PrevPathProvider>
        </ProgressBarProvider>
        <TooltipInit />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getEnv('SITE_PUBLIC_URL')),
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
  colorScheme: 'light dark',
}
