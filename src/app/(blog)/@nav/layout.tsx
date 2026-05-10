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
        border-b border-black/5 bg-[#f2f1f0]/60
        dark:border-white/10 dark:bg-[#0f0d0b]/70
        sticky top-0 -mb-10 z-50 backdrop-blur-lg h-10 text-xs font-mono
      "
    >
      <div className="max-w-2xl mx-auto px-3 sm:px-6 md:px-8">
        <div className="flex justify-between flex-nowrap items-center h-10">
          {children}
          <div className="flex space-x-3">
            <Link
              href="/about"
              className="
                group/btn relative block opacity-70
                hover:opacity-100
                transition-all
              "
            >
              <div className="size-4">
                <DownasaurIcon />
              </div>
            </Link>

            <Link
              href="/feeds"
              className="
                group/btn relative block opacity-70
                hover:opacity-100
                transition-all
              "
            >
              <div className="size-4">
                <FeedIcon />
              </div>
            </Link>

            <SwitchThemeButton
              aria-label="Switch color theme"
              className="group/btn opacity-70 hover:opacity-100 transition-all"
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
