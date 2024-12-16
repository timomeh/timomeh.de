import Link from 'next/link'

import { FeedIcon } from './icons/feed'
import { ArchiveIcon } from './icons/archive'
import { BlueskyIcon } from './icons/bluesky'
import { ThemeSwitcher } from './theme-switcher'

export async function SocialBox() {
  return (
    <div className="absolute right-4 top-4">
      <div
        className="flex gap-3 p-2 text-gray-900 group-has-[.social-bg-signal]/body:rounded-md
          group-has-[.social-bg-signal]/body:bg-white/10
          group-has-[.social-bg-signal]/body:backdrop-blur-md
          group-has-[.social-bg-signal]/body:backdrop-brightness-125 sm:gap-2
          dark:text-white dark:backdrop-blur-none
          dark:group-has-[.social-bg-signal]/body:bg-black/30"
      >
        <Link
          title="Archive"
          href="/archive"
          className="-m-1 block p-1 opacity-70 transition-[opacity,transform] hover:scale-110
            hover:opacity-100 active:scale-95"
        >
          <div className="size-3.5">
            <ArchiveIcon />
          </div>
        </Link>
        <a
          title="@timomeh.de on Bluesky"
          href="https://bsky.app/profile/timomeh.de"
          rel="noopener noreferrer"
          target="_blank"
          className="-m-1 block p-1 opacity-70 transition-[opacity,transform] hover:scale-110
            hover:opacity-100 active:scale-95"
          data-umami-event="Bluesky link"
        >
          <div className="size-3.5">
            <BlueskyIcon />
          </div>
        </a>
        <Link
          title="Feeds"
          href="/feeds"
          className="-m-1 block p-1 opacity-70 transition-[opacity,transform] hover:scale-110
            hover:opacity-100 active:scale-95"
        >
          <div className="size-3.5">
            <FeedIcon />
          </div>
        </Link>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
