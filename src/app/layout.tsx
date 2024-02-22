import Link from 'next/link'

import { Inter, Outfit, Silkscreen, IBM_Plex_Mono } from 'next/font/google'

import '@/styles/globals.css'
import clsx from 'clsx'
import me from '@/parts/head/it_me.png'
import Image from 'next/image'

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

const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-silkscreen',
})

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={clsx`
        h-full scroll-smooth antialiased [font-feature-settings:'ss01']
        bg-[#1F1D22] text-white
        ${silkscreen.variable} ${ibmPlexMono.variable} ${outfit.variable} ${inter.variable}
      `}
    >
      <body>
        <div>
          <header className="relative flex flex-row sm:items-center items-start sm:flex-col max-w-2xl mx-auto py-10 px-4 overflow-hidden">
            <div className="relative flex items-center justify-center">
              <div className="absolute transform rotate-6 w-[600px] h-[400px] bg-gradient-radial from-purple-300 opacity-15 mix-blend-difference" />
              <Link href="/" className="relative">
                <Image
                  src={me}
                  alt=""
                  className="select-none size-28 object-contain hover:scale-[1.2] hover:rotate-3 transition-transform duration-400 ease-in"
                />
              </Link>
            </div>
            <div className="size-4" />
            <div className="sm:absolute sm:w-[50%] sm:self-end sm:pl-[80px] mt-4 sm:mt-[80px] group self-center">
              <div className="pointer-events-none group-hover:scale-125 group-hover:rotate-[30deg] transition-transform duration-1000 ease-in-out absolute w-[100px] h-[40px] rotate-[35deg] -mt-1 ml-16 rounded-[100%] border border-yellow-50/10">
                <div className="w-1 h-1 bg-yellow-200/50 rounded-full orbit-dot" />
              </div>
              <div className="font-display font-medium text-sm text-yellow-100 leading-none [text-shadow:0px_0px_6px_rgba(0,0,0,0.3)]">
                <span className="block">
                  a head full of software engineering by
                </span>
                <span className="block -mt-0.5">
                  <Link href="/about" className="font-bold text-xl text-nowrap">
                    Timo Mämecke
                  </Link>
                </span>
              </div>
            </div>
          </header>
          {children}
          <footer className="flex justify-end max-w-2xl mx-auto py-10 px-4">
            <div className="text-[11px] uppercase font-bold">
              <ul className="flex space-x-1">
                <li>
                  <Link
                    href="/impressum"
                    className="opacity-30 hover:opacity-60 transition-opacity"
                  >
                    Impressum
                  </Link>
                </li>
                <li className="opacity-30">&</li>
                <li>
                  <Link
                    href="/datenschutz"
                    className="opacity-30 hover:opacity-60 transition-opacity"
                  >
                    Datenschutz
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
  themeColor: '#141315',
}
