import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter, Outfit, IBM_Plex_Mono } from '@next/font/google'

import 'prism-themes/themes/prism-one-light.css'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const ibm = IBM_Plex_Mono({
  weight: ['500'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ibm',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`antialiased [font-feature-settings:'ss01'] ${inter.variable} ${outfit.variable} ${ibm.variable} font-sans`}
    >
      <Head>
        <title key="title">Timo Mämecke</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
