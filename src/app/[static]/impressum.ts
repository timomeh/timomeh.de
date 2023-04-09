import { Metadata } from 'next'

export const body = `
# Impressum

Timo Mämecke  
Karl-Korn-Straße 18  
50678 Köln  
Deutschland – Germany

## Contact

E-Mail: [hello@timomeh.de](mailto:hello@timomeh.de)
`

export const head: Metadata = {
  title: 'Impressum',
  openGraph: {
    images: [
      {
        url: '/assets/og-image/static/impressum.png',
        height: 630,
        width: 1200,
      },
    ],
  },
}
