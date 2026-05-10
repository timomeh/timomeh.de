import Link from 'next/link'

import { DarkLightIcon } from '../../../comps/icons/darklight'
import { DownasaurIcon } from '../../../comps/icons/downasaur'
import { FeedIcon } from '../../../comps/icons/feed'
import { SwitchThemeButton } from '../../../comps/switch-theme-button'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div
      className="
        sticky top-0 z-50 -mb-10 h-10 border-b border-black/5 bg-[#f2f1f0]/60
        font-mono text-xs backdrop-blur-lg
        dark:border-white/10 dark:bg-[#0f0d0b]/70
      "
    >
      <div className="mx-auto max-w-2xl px-3 sm:px-6 md:px-8">
        <div className="flex h-10 flex-nowrap items-center justify-between">
          {children}
          <div className="flex space-x-3">
            <Link
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

            <SwitchThemeButton
              aria-label="Switch color theme"
              className="group/btn opacity-70 transition-all hover:opacity-100"
              type="button"
            >
              <div className="size-4">
                <DarkLightIcon />
              </div>
            </SwitchThemeButton>
          </div>
        </div>
      </div>
    </div>
  )
}
