import type { AppProps } from 'next/app'

import '@fontsource/inter/variable-full.css'
import '@fontsource/outfit/variable-full.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
