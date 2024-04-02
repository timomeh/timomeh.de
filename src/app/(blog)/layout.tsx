import Link from 'next/link'

import { Header } from '@/comps/header'

type Props = {
  children: React.ReactNode
  backdrop: React.ReactNode
  nextPost: React.ReactNode
  prevPost: React.ReactNode
}

export default function BlogLayout({
  children,
  backdrop,
  nextPost,
  prevPost,
}: Props) {
  return (
    <>
      {nextPost}
      <div className="flex min-h-dvh flex-col">
        <header className="relative w-full">
          <div className="relative z-10">
            <Header />
          </div>
          {backdrop}
        </header>
        <main className="relative z-30 w-full flex-1">{children}</main>
        <footer className="relative z-30 mx-auto flex w-full max-w-2xl justify-end px-4 py-10">
          <div
            className="font-pixel text-[9px] font-bold uppercase antialiased
              [font-feature-settings:'ss01']"
          >
            <ul className="flex space-x-1">
              <li>
                <Link
                  href="/feeds"
                  className="text-white/30 transition-colors hover:text-white/60"
                >
                  Feeds
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link
                  href="/impressum"
                  className="text-white/30 transition-colors hover:text-white/60"
                >
                  Imprint
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-white/30 transition-colors hover:text-white/60"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
      {prevPost}
    </>
  )
}
