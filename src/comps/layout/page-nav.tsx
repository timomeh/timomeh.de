import Link from 'next/link'

import { ArchiveIcon } from '@/comps/icons/archive'
import { DarkLightIcon } from '@/comps/icons/darklight'
import { DownasaurIcon } from '@/comps/icons/downasaur'
import { FeedIcon } from '@/comps/icons/feed'
import { SearchIcon } from '@/comps/icons/search'
import { KeyboardNavLink } from '@/comps/keyboard-nav-link'
import { SwitchThemeButton } from '@/comps/switch-theme-button'

type Props = {
  children?: React.ReactNode
}

export function PageNav({ children }: Props) {
  return (
    <div
      id="nav"
      className="
        fixed top-0 right-0 left-0 z-50 -mb-10 h-10 border-b border-black/5
        bg-[#f2f1f0]/60 font-mono text-xs backdrop-blur-lg
        dark:border-white/10 dark:bg-[#0f0d0b]/70
      "
    >
      <KeyboardNavLink href="#main">Skip navigation to main</KeyboardNavLink>
      <div className="mx-auto max-w-2xl px-3 sm:px-6 md:px-8">
        <div className="flex h-10 flex-nowrap items-center justify-between">
          {children || <div />}
          <nav aria-label="Shortcuts" className="flex space-x-3">
            <Link
              aria-label="About me"
              data-tooltip-id="page-tt"
              data-tooltip-content="About me"
              href="/about"
              className="
                group/btn relative block opacity-70 transition-all
                hover:opacity-100
              "
            >
              <div className="size-4">
                <DownasaurIcon />
              </div>
            </Link>

            <Link
              aria-label="Feed"
              data-tooltip-id="page-tt"
              data-tooltip-content="Feed"
              href="/feeds"
              className="
                group/btn relative block opacity-70 transition-all
                hover:opacity-100
              "
            >
              <div className="size-4">
                <FeedIcon />
              </div>
            </Link>

            <Link
              aria-label="Archive"
              data-tooltip-id="page-tt"
              data-tooltip-content="Archive"
              href="/archive"
              className="
                group/btn relative block opacity-70 transition-all
                hover:opacity-100
              "
            >
              <div className="size-4">
                <ArchiveIcon />
              </div>
            </Link>

            <Link
              aria-label="Search"
              data-tooltip-id="page-tt"
              data-tooltip-content="Search"
              href="/search"
              scroll={false}
              className="
                group/btn relative block opacity-70 transition-all
                hover:opacity-100
              "
            >
              <div className="size-4">
                <SearchIcon />
              </div>
            </Link>

            <SwitchThemeButton
              aria-label="Switch color theme"
              data-tooltip-id="page-tt"
              data-tooltip-content="Change theme"
              className="group/btn opacity-70 transition-all hover:opacity-100"
              type="button"
            >
              <div className="size-4">
                <DarkLightIcon />
              </div>
            </SwitchThemeButton>
          </nav>
        </div>
      </div>
    </div>
  )
}
