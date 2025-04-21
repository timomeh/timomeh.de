import { Card } from '@/comps/card'

import { LinksWidget } from '../_widgets/links-widget'
import { SortWidget } from '../_widgets/sort-widget'
import { TagsWidget } from '../_widgets/tags-widget'
import { YearsWidget } from '../_widgets/years-widget'

type Props = {
  params: Promise<{ tag?: string; year?: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function PostsListSidebar({ params, searchParams }: Props) {
  const sortParam = (await searchParams).sort
  const yearParam = (await params).year
  const tagParam = (await params).tag

  return (
    <div
      className="@container top-0 max-h-dvh w-[220px] rounded-xl max-sm:bg-white/40
        max-sm:shadow-lg/40 max-sm:backdrop-blur-sm sm:sticky sm:w-[86px] sm:py-2
        lg:w-[220px] dark:max-sm:bg-black/40"
    >
      <Card>
        <div>
          <section aria-label="Years" className="@max-5xs:p-1 p-2">
            <YearsWidget
              sortParam={sortParam}
              tagParam={tagParam}
              yearParam={yearParam}
            />
          </section>
          <section
            aria-label="Sort"
            className="@max-5xs:p-1 border-t border-gray-400/30 p-2 dark:border-gray-600/30"
          >
            <SortWidget sortParam={sortParam} />
          </section>
          <section
            aria-label="Tags"
            className="@max-5xs:hidden @max-5xs:p-1 border-t border-gray-400/30 p-2
              dark:border-gray-600/30"
          >
            <TagsWidget sortParam={sortParam} tagParam={tagParam} />
          </section>
          <section
            aria-label="Links"
            className="@max-5xs:p-1 border-t border-gray-400/30 p-2 dark:border-gray-600/30"
          >
            <LinksWidget />
          </section>
        </div>
      </Card>
    </div>
  )
}
