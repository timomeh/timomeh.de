import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { StoreProvider } from '@/lib/store'
import { MastodonLogo } from '@/components/MastodonLogo'

import '@/styles/globals.css'
import '@fontsource/ibm-plex-mono/latin-ext.css'
import '@fontsource/inter/latin.css'
import '@fontsource/outfit/latin.css'
import { RssIcon, UserCircleIcon } from '@heroicons/react/20/solid'

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full relative antialiased [font-feature-settings:'ss01'] bg-[#1F1E20] text-white">
        <StoreProvider>
          <div className="absolute inset-0 [background-image:var(--grainy)] [background-size:300px] filter contrast-[2000%] brightness-[50%] mix-blend-multiply z-[-1] opacity-70" />
          <div className="meh-grid">
            {children}
            <header className="meh-header">
              <div className="flex pl-4 lg:pl-0 lg:justify-end pt-4 lg:pt-8 pb-6">
                <Link href="/">
                  <Logo className="h-10 w-auto" />
                </Link>
              </div>
            </header>
            <nav className="meh-nav">
              <div className="flex flex-col pr-4 pt-6 lg:pt-0 lg:pr-0 items-end">
                <div>
                  <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-1 items-end">
                    <NavLink segment="offtopic" href="/">
                      Stream
                    </NavLink>
                    <NavLink segment="posts" href="/posts">
                      Posts
                    </NavLink>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 items-center">
                  <Link title="Feeds" href="/feeds">
                    <RssIcon className="w-6 h-6 -m-1 p-1 fill-white/60 hover:fill-white/90 transition-colors" />
                  </Link>
                  <a
                    title="@timomeh@mastodon.social"
                    href="https://mastodon.social/@timomeh"
                    rel="noopener noreferrer me"
                  >
                    <MastodonLogo className="w-[22px] h-[22px] fill-white/60 hover:fill-white/90 -m-1 p-1 transition-colors" />
                  </a>
                  <Link title="About" href="/about">
                    <UserCircleIcon className="w-6 h-6 -m-1 p-1 fill-white/60 hover:fill-white/90 transition-colors" />
                  </Link>
                </div>
              </div>
            </nav>
            <footer className="meh-footer">
              <div className="flex justify-end text-[11px] uppercase font-bold space-x-1">
                <Link
                  href="/impressum"
                  className="opacity-30 hover:opacity-60 transition-opacity"
                >
                  Impressum
                </Link>
                <div className="opacity-30">&</div>
                <Link
                  href="/datenschutz"
                  className="opacity-30 hover:opacity-60 transition-opacity"
                >
                  Datenschutz
                </Link>
              </div>
            </footer>
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
