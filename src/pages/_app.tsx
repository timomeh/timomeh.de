import type { AppProps } from 'next/app'

import '@fontsource/inter/latin.css'
import '@fontsource/outfit/latin.css'
import '@fontsource/ibm-plex-mono/500.css'
import 'prism-themes/themes/prism-one-light.css'
import '../styles/globals.css'
import '../styles/prism.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
