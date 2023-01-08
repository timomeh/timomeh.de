import Link from 'next/link'
import { Inter, Outfit, IBM_Plex_Mono } from '@next/font/google'

import { Logo } from '../components/Logo'

import 'prism-themes/themes/prism-one-light.css'
import '../styles/globals.css'
import { Navigation } from './Navigation'

type Props = {
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const ibm = IBM_Plex_Mono({
  weight: ['500'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ibm',
})

export default function RootLayout({ children }: Props) {
  return (
    <html
      className={`antialiased [font-feature-settings:'ss01'] ${inter.variable} ${outfit.variable} ${ibm.variable}`}
      lang="en"
    >
      <body>
        <div>
          <div className="absolute flex justify-center h-80 w-full z-[-1] pointer-events-none overflow-hidden">
            <div className="absolute h-[300px] flex-none w-[800px] -ml-[600px] bg-gradient-radial from-pink-500/20 via-transparent" />
            <div className="absolute h-[300px] flex-none w-[800px] bg-gradient-radial from-cyan-500/20 via-transparent" />
            <div className="absolute h-[300px] flex-none w-[800px] -mr-[600px] bg-gradient-radial from-lime-500/20 via-transparent" />
          </div>
          <div>
            <div className="min-w-0 max-w-2xl flex-auto px-4 mx-auto pt-6 pb-4">
              <nav className="flex items-center">
                <Link href="/" className="block p-2 -m-2">
                  <Logo className="h-8 w-auto fill-black/80" />
                </Link>
                <div className="flex-1" />
                <Navigation />
              </nav>
            </div>
          </div>
          <div className="min-w-0 max-w-2xl flex-auto px-4 pb-16 py-8 mx-auto">
            {children}
          </div>
          <footer className="min-w-0 max-w-2xl flex-auto px-4 mx-auto py-6">
            <div className="flex justify-end space-x-3 text-xs text-slate-500 prose-base hover:prose-a:underline">
              <Link href="/imprint" className="hover:underline">
                Imprint
              </Link>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
