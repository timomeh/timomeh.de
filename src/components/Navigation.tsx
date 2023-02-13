'use client'

import {
  ArrowSmallLeftIcon,
  RssIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MastodonLogo } from './MastodonLogo'
import { NavLink } from './NavLink'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  let backUrl
  if (/^\/posts\/(?!page\/).*$/.test(pathname || '')) backUrl = '/posts'
  if (/^\/offtopic\/(?!page\/).*$/.test(pathname || '')) backUrl = '/'

  return (
    <motion.nav layout className="meh-nav pointer-events-none">
      <div className="flex lg:flex-col pr-4 pt-6 lg:pt-0 lg:pr-0 items-center justify-end lg:items-end space-x-4 lg:space-x-0">
        <div className="pointer-events-auto">
          <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-1 items-end">
            {backUrl && (
              <Link
                href={backUrl}
                onClick={(event) => {
                  event.preventDefault()
                  router.back()
                }}
                className="hidden mt-[-28px] lg:flex py-1 items-center relative justify-center uppercase text-sm leading-none tracking-wide font-display font-bold opacity-50 hover:opacity-80 transition-opacity"
              >
                <ArrowSmallLeftIcon className="w-4 h-4 mr-1" />
                <span className="inline-block">Back</span>
              </Link>
            )}
            <NavLink segment="offtopic" href="/">
              Stream
            </NavLink>
            <NavLink segment="posts" href="/posts">
              Posts
            </NavLink>
          </div>
        </div>
        <div className="flex space-x-3 lg:mt-4 items-center pointer-events-auto">
          <NavLink segment="feeds" href="/feeds" backDot>
            <RssIcon className="w-6 h-6 -m-1 p-1" title="Feeds" />
          </NavLink>
          <a
            title="@timomeh@mastodon.social"
            href="https://mastodon.social/@timomeh"
            rel="noopener noreferrer me"
            target="_blank"
          >
            <MastodonLogo className="w-[22px] h-[22px] fill-white opacity-50 hover:opacity-80 -m-1 p-1 transition-opacity" />
          </a>
          <NavLink segment="about" href="/about" backDot>
            <UserCircleIcon className="w-6 h-6 -m-1 p-1" title="About" />
          </NavLink>
        </div>
      </div>
    </motion.nav>
  )
}
