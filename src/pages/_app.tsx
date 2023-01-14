import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/inter/latin.css'
import '@fontsource/outfit/latin.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'prism-themes/themes/prism-one-light.css'

import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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
    </>
  )
}

export default MyApp
