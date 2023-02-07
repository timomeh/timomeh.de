import { NextSeo } from 'next-seo'

export function CommonHead() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
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
      <NextSeo
        useAppDir={true}
        themeColor="#16161d"
        openGraph={{
          siteName: 'Timo Mämecke',
        }}
      />
      <meta name="author" content="Timo Mämecke" />
    </>
  )
}
