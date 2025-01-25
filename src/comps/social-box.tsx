import Link from 'next/link'

import { FeedIcon } from './icons/feed'
import { ArchiveIcon } from './icons/archive'
import { BlueskyIcon } from './icons/bluesky'
import { ThemeSwitcher } from './theme-switcher'

export async function SocialBox() {
  return (
    <div className="absolute top-4 right-4">
      <div
        className="flex gap-3 p-2 text-gray-900 group-has-[.social-bg-signal]/body:overflow-hidden
          group-has-[.social-bg-signal]/body:rounded-md
          group-has-[.social-bg-signal]/body:bg-white/10
          group-has-[.social-bg-signal]/body:backdrop-blur-md
          group-has-[.social-bg-signal]/body:backdrop-brightness-125 dark:text-white
          dark:backdrop-blur-none dark:group-has-[.social-bg-signal]/body:bg-black/30"
      >
        <Link
          title="Archive"
          href="/archive"
          className="group/btn -m-1 block p-1 opacity-70 transition hover:opacity-100 active:scale-95"
        >
          <div className="size-4">
            <ArchiveIcon />
          </div>
        </Link>
        <a
          title="@timomeh.de on Bluesky"
          href="https://bsky.app/profile/timomeh.de"
          rel="noopener noreferrer"
          target="_blank"
          className="group/btn -m-1 block p-1 opacity-70 transition hover:opacity-100 active:scale-95"
        >
          <div className="size-4">
            <BlueskyIcon />
          </div>
        </a>
        <Link
          title="Feeds"
          href="/feeds"
          className="group/btn -m-1 block p-1 opacity-70 transition hover:opacity-100 active:scale-95"
        >
          <div className="size-4">
            <FeedIcon />
          </div>
        </Link>
        <div className="-ml-0.5">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  )
}
