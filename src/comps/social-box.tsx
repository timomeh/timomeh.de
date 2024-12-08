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
        <div className="-mx-1 -my-2.5 px-1 py-2">
          <Link
            title="Archive"
            href="/archive"
            className="block opacity-70 transition-opacity hover:opacity-100"
          >
            <div className="size-5 p-px">
              <ArchiveIcon />
            </div>
          </Link>
        </div>
        <div className="-mx-1 my-[-7px] px-1 py-2">
          <a
            title="@timomeh.de on Bluesky"
            href="https://bsky.app/profile/timomeh.de"
            rel="noopener noreferrer"
            target="_blank"
            className="block opacity-70 transition-opacity hover:opacity-100"
            data-umami-event="Bluesky link"
          >
            <div className="size-3.5">
              <BlueskyIcon />
            </div>
          </a>
        </div>
        <div className="-mx-1 -my-2 px-1 py-2">
          <Link
            title="Feeds"
            href="/feeds"
            className="block opacity-70 transition-opacity hover:opacity-100"
          >
            <div className="size-4 p-px">
              <FeedIcon />
            </div>
          </Link>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
