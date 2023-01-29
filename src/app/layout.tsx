import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/inter/latin.css'
import '@fontsource/outfit/latin.css'
import Link from 'next/link'
import 'prism-themes/themes/prism-one-light.css'

import { Navigation } from '@/app/Navigation'
import { Logo } from '@/components/Logo'
import '@/styles/globals.css'
import { Prose } from '@/components/Prose'
import NavLink from '@/components/NavLink'

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <body className="min-h-full relative antialiased [font-feature-settings:'ss01'] bg-[#1F1E20] text-white">
        <div className="absolute inset-0 [background-image:var(--grainy)] [background-size:300px] filter contrast-[2000%] brightness-[50%] mix-blend-multiply z-[-1] opacity-70" />
        <div className="meh-grid">
          <header className="meh-header">
            <div className="flex flex-col items-end text-white font-mono">
              <div className="h-8" />
              <Logo className="h-10 w-auto" />
              <div className="h-[84px]" />

              <nav className="space-y-1 flex flex-col items-end">
                <NavLink segment="offtopic" href="/">
                  Stream
                </NavLink>
                <NavLink segment="posts" href="/posts">
                  Posts
                </NavLink>
                <NavLink segment="about" href="/about">
                  About
                </NavLink>
              </nav>
            </div>
          </header>
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
          {children}
        </div>
      </body>
    </html>
  )
}

function ThoughtsIcon() {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-4 h-4"
    >
      <path
        d="M22 2H2v14h2V4h16v12h-8v2h-2v2H8v-4H2v2h4v4h4v-2h2v-2h10V2z"
        fill="currentColor"
      />
    </svg>
  )
}

function PostsIcon() {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-4 h-4"
    >
      <path
        d="M3 3h8v2H3v12h8V5h2v12h8V5h-8V3h10v16H13v2h-2v-2H1V3h2zm16 7h-4v2h4v-2zm-4-3h4v2h-4V7zm2 6h-2v2h2v-2z"
        fill="currentColor"
      />
    </svg>
  )
}
