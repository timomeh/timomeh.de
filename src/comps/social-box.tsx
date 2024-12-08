import Link from 'next/link'

import { FeedIcon } from './icons/feed'
import { ArchiveIcon } from './icons/archive'
import { BlueskyIcon } from './icons/bluesky'
import { MoonIcon } from './icons/moon'
import { SunIcon } from './icons/sun'
import { cookies } from 'next/headers'

export async function SocialBox() {
  const currentTheme = (await cookies()).get('theme')?.value ?? 'dark'

  return (
    <div className="absolute right-4 top-4">
      <div
        className="flex gap-4 p-2 text-gray-900 group-has-[.social-bg-signal]/body:rounded-md
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
        <form
          className="-ml-px"
          action={async () => {
            'use server'

            const c = await cookies()
            c.set('theme', currentTheme === 'dark' ? 'light' : 'dark', {
              httpOnly: true,
              maxAge: 315_360_000,
            })
          }}
        >
          <button
            title="Switch color mode"
            className="block opacity-70 transition-opacity hover:opacity-100"
            value="light"
          >
            {currentTheme === 'dark' ? (
              <div className="m-px size-3.5">
                <MoonIcon />
              </div>
            ) : (
              <div className="h-4 w-4">
                <SunIcon />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
