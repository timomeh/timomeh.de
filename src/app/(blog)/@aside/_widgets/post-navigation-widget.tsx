import { RedoIcon, UndoIcon } from 'lucide-react'
import Link from 'next/link'

import { getNewerPost, getOlderPost } from '@/data/posts'

type Props = {
  currentSlug: string
}

export async function PostNavigationWidget({ currentSlug }: Props) {
  const newerPost = await getNewerPost(currentSlug)
  const olderPost = await getOlderPost(currentSlug)

  return (
    <div className="@max-5xs:gap-1 flex flex-col items-stretch gap-2">
      {newerPost && (
        <Link
          className="group/btn"
          href={`/posts/${newerPost.slug}`}
          aria-label="Next post"
        >
          <Item>
            <div
              className="@max-5xs:!bg-transparent flex shrink-0 items-center justify-center bg-gray-900/5
                p-1 dark:bg-white/5"
            >
              <UndoIcon className="size-4" />
            </div>
            <div className="@max-5xs:block hidden text-xs font-medium">
              Next
            </div>
            <div
              className="@max-5xs:hidden min-w-0 flex-1 border-l border-gray-900/10 p-2
                dark:border-white/10"
            >
              <div className="text-xs font-medium opacity-70">
                {new Date(newerPost.publishedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div className="truncate text-xs font-medium">
                {newerPost.title}
              </div>
            </div>
          </Item>
        </Link>
      )}
      {olderPost && (
        <Link
          className="group/btn"
          href={`/posts/${olderPost.slug}`}
          aria-label="Previous post"
        >
          <Item>
            <div
              className="@max-5xs:hidden min-w-0 flex-1 border-r border-gray-900/10 p-2
                dark:border-white/10"
            >
              <div className="text-xs font-medium opacity-70">
                {new Date(olderPost.publishedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div className="truncate text-xs font-medium">
                {olderPost.title}
              </div>
            </div>
            <div
              className="@max-5xs:!bg-transparent flex shrink-0 items-center justify-center bg-gray-900/5
                p-1 dark:bg-white/5"
            >
              <RedoIcon className="size-4" />
            </div>
            <div className="@max-5xs:block hidden text-xs font-medium">
              Prev
            </div>
          </Item>
        </Link>
      )}
    </div>
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
      <div className="@max-5xs:items-center @max-5xs:gap-1 @max-5xs:justify-center flex">
        {props.children}
      </div>
    </div>
  )
}
