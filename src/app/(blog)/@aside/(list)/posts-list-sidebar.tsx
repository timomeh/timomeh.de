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
        max-sm:shadow-xl/20 max-sm:backdrop-blur-sm sm:sticky sm:w-[86px] sm:py-2
        lg:w-[220px] dark:max-sm:bg-black/40"
    >
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <section aria-label="Years" className="sticky top-0">
            <YearsWidget
              sortParam={sortParam}
              tagParam={tagParam}
              yearParam={yearParam}
            />
          </section>
          <section aria-label="Sort">
            <SortWidget sortParam={sortParam} />
          </section>
          <section aria-label="Tags" className="@max-5xs:hidden">
            <TagsWidget sortParam={sortParam} tagParam={tagParam} />
          </section>
          <section aria-label="Links">
            <LinksWidget />
          </section>
        </div>
      </Card>
    </div>
  )
}
