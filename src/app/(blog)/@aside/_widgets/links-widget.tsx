import Link from 'next/link'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { DarkLightIcon } from '@/comps/icons/darklight'
import { DownasaurIcon } from '@/comps/icons/downasaur'
import { FeedIcon } from '@/comps/icons/feed'
import { SwitchThemeButton } from '@/comps/switch-theme-button'

export function LinksWidget() {
  return (
    <ViewTransition name="sidebar-links-widget">
      <div className="@max-5xs:grid-cols-1 @max-5xs:p-1 grid grid-cols-3 gap-1 p-2">
        {/* <Link href="/tags" className="group/btn @max-5xs:block relative hidden">
          <Item>
            <div className="@max-5xs:size-3 size-4">
              <TagIcon className="size-full" />
            </div>
            <div className="text-xs font-medium">Tags</div>
          </Item>
        </Link> */}
        <SwitchThemeButton
          aria-label="Switch color theme"
          className="group/btn"
          type="button"
        >
          <Item>
            <div className="@max-5xs:size-3 size-4">
              <DarkLightIcon />
            </div>
            <div className="text-xs font-medium">
              <span className="hidden group-data-[theme=light]/root:inline">
                Light
              </span>
              <span className="hidden group-data-[theme=dark]/root:inline">
                Dark
              </span>
              <span className="hidden group-data-[theme=system]/root:inline">
                System
              </span>
            </div>
          </Item>
        </SwitchThemeButton>
        <Link href="/feeds" className="group/btn relative block">
          <Item>
            <div className="@max-5xs:size-3 size-4">
              <FeedIcon />
            </div>
            <div className="text-xs font-medium">Feed</div>
          </Item>
        </Link>
        <Link href="/about" className="group/btn relative block">
          <Item>
            <div className="@max-5xs:size-3 size-4">
              <DownasaurIcon />
            </div>
            <div className="text-xs font-medium">About</div>
          </Item>
        </Link>
      </div>
    </ViewTransition>
  )
}

function Item(props: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border border-gray-900/10 bg-gray-900/2 text-gray-900/80 transition
        group-hover/btn:border-gray-900/10 group-hover/btn:bg-gray-900/5
        group-hover/btn:text-gray-900 in-data-[current=true]:!border-transparent
        in-data-[current=true]:!bg-transparent dark:border-white/10 dark:bg-white/2
        dark:text-white/80 dark:group-hover/btn:border-white/10
        dark:group-hover/btn:bg-white/5 dark:group-hover/btn:text-white"
    >
      <div
        className="@max-5xs:gap-1 @max-5xs:px-1 @max-5xs:py-1 @max-5xs:flex-row flex flex-col
          items-center justify-center gap-0.5 py-2"
      >
        {props.children}
      </div>
    </div>
  )
}
