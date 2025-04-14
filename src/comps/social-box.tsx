import Link from 'next/link'

import { DownasaurIcon } from './icons/downasaur'
import { ThemeSwitcher } from './theme-switcher'

export async function SocialBox() {
  return (
    <div className="absolute top-4 right-4">
      <div className="flex gap-3 p-2 text-gray-900 dark:text-white dark:backdrop-blur-none">
        <Link
          title="About"
          href="/about"
          className="group/btn -m-1 block p-1 opacity-70 transition hover:opacity-100 active:scale-95"
        >
          <div className="size-4">
            <DownasaurIcon />
          </div>
        </Link>
        <div className="-ml-0.5">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  )
}
