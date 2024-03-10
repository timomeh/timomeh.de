import Link from 'next/link'

import { FeedIcon } from './icons/feed'
import { MastodonIcon } from './icons/mastodon'

type Props = {
  floating?: boolean
}

export function SocialBox({ floating }: Props) {
  return (
    <div className="absolute right-4 top-4">
      <div
        data-floating={floating}
        className="flex gap-2 p-2 text-white data-[floating=true]:rounded-md
          data-[floating=true]:bg-black/30"
      >
        <a
          title="@timomeh@mastodon.social"
          href="https://mastodon.social/@timomeh"
          rel="noopener noreferrer me"
          target="_blank"
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          <div className="size-4">
            <MastodonIcon />
          </div>
        </a>
        <Link
          href="/feeds"
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          <div className="size-4 p-px">
            <FeedIcon />
          </div>
        </Link>
      </div>
    </div>
  )
}
