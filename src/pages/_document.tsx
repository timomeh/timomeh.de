import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="antialiased [font-feature-settings:'ss01']" lang="en">
      <Head />
      <body className="bg-night-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
