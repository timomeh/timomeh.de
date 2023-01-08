'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { GithubLogo } from '../components/GithubLogo'
import { MastodonLogo } from '../components/MastodonLogo'
import { usePathname } from 'next/navigation'
import { RssIcon } from '@heroicons/react/20/solid'

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="text-sm flex font-medium text-black/60 space-x-6 items-center">
      <Link
        href="/"
        className={clsx(
          'hover:text-black/90 transition-colors',
          pathname === '/' ? 'text-black/90' : 'text-black/60'
        )}
      >
        Hello
      </Link>

      <Link
        href="/posts"
        className={clsx(
          'hover:text-black/90 transition-colors',
          pathname?.startsWith('/posts') ? 'text-black/90' : 'text-black/60'
        )}
      >
        Posts
      </Link>

      {/* <a
        href="https://twitter.com/timomeh"
        rel="noopener noreferrer"
        target="_blank"
        className=" fill-black/60 hover:fill-black/90 transition-colors"
      >
        <TwitterLogo className="w-6 h-6 -m-1 p-1" />
      </a> */}

      <a
        title="@timomeh@mastodon.social"
        href="https://mastodon.social/@timomeh"
        rel="noopener noreferrer me"
        target="_blank"
        className=" fill-black/60 hover:fill-black/90 transition-colors"
      >
        <MastodonLogo className="w-6 h-6 -m-1 p-1" />
      </a>

      <a
        title="View on GitHub"
        href="https://github.com/timomeh/timomeh.de/discussions"
        rel="noopener noreferrer"
        target="_blank"
        className=" fill-black/60 hover:fill-black/90 transition-colors"
      >
        <GithubLogo className="w-[26px] h-[26px] -m-1 p-1" />
      </a>

      <a
        title="RSS Feed"
        href="/posts/feed.rss"
        target="_blank"
        className=" fill-black/60 hover:fill-black/90 transition-colors"
      >
        <RssIcon className="w-[26px] h-[26px] -m-1 p-1" />
      </a>
    </div>
  )
}
