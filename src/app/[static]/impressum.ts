import { NextSeoProps } from 'next-seo'

export const body = `
# Impressum

Timo Mämecke  
Karl-Korn-Straße 18  
50678 Köln  
Deutschland – Germany

## Contact

E-Mail: [hello@timomeh.de](mailto:hello@timomeh.de)
`

export const head: NextSeoProps = {
  title: 'Impressum',
  openGraph: {
    images: [
      {
        url: 'https://timomeh.de/assets/og-image/static/impressum.png',
        type: 'image/png',
      },
    ],
  },
}
