import Link from 'next/link'

import { FeedIcon } from './icons/feed'
import { MastodonIcon } from './icons/mastodon'
import { ArchiveIcon } from './icons/archive'
import { BlueskyIcon } from './icons/bluesky'

export function SocialBox() {
  return (
    <div className="absolute right-4 top-4">
      <div
        className="flex gap-4 p-2 text-white group-has-[.social-bg-signal]/body:rounded-md
          group-has-[.social-bg-signal]/body:bg-black/30 sm:gap-2"
      >
        <Link
          title="Archive"
          href="/archive"
          className="-mx-1 -my-2.5 px-1 py-2 opacity-70 transition-opacity hover:opacity-100"
        >
          <div className="size-5 p-px">
            <ArchiveIcon />
          </div>
        </Link>
        <a
          title="@timomeh@mastodon.social on Mastodon"
          href="https://mastodon.social/@timomeh"
          rel="noopener noreferrer me"
          target="_blank"
          className="-mx-1 -my-2 px-1 py-2 opacity-70 transition-opacity hover:opacity-100"
        >
          <div className="size-4">
            <MastodonIcon />
          </div>
        </a>
        <a
          title="@timomeh.de on Bluesky"
          href="https://bsky.app/profile/timomeh.de"
          rel="noopener noreferrer"
          target="_blank"
          className="-mx-1 my-[-7px] px-1 py-2 opacity-70 transition-opacity hover:opacity-100"
        >
          <div className="size-3.5">
            <BlueskyIcon />
          </div>
        </a>
        <Link
          title="Feeds"
          href="/feeds"
          className="-mx-1 -my-2 px-1 py-2 opacity-70 transition-opacity hover:opacity-100"
        >
          <div className="size-4 p-px">
            <FeedIcon />
          </div>
        </Link>
      </div>
    </div>
  )
}
