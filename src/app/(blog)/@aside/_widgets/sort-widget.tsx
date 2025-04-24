import { CalendarArrowDownIcon, CalendarArrowUpIcon } from 'lucide-react'

import { ChangeSortLink } from '@/comps/change-sort-link'

import { LayoutAnimated } from '../../../../comps/LayoutAnimated'

type Props = {
  sort?: 'asc' | 'desc' | null
}

export function SortWidget({ sort }: Props) {
  return (
    <div className="grid grid-cols-2 gap-1">
      <ChangeSortLink
        sort={null}
        className="group/btn relative block"
        data-current={sort !== 'asc'}
      >
        <Item active={sort !== 'asc'}>
          <CalendarArrowDownIcon className="@max-5xs:size-3.5 size-4" />
          <div className="@max-5xs:sr-only text-xs font-medium">new to old</div>
        </Item>
      </ChangeSortLink>
      <ChangeSortLink
        sort="asc"
        className="group/btn relative block"
        data-current={sort === 'asc'}
      >
        <Item active={sort === 'asc'}>
          <CalendarArrowUpIcon className="@max-5xs:size-3.5 size-4" />
          <div className="@max-5xs:sr-only text-xs font-medium">old to new</div>
        </Item>
      </ChangeSortLink>
    </div>
  )
}

function Item(props: { children: React.ReactNode; active: boolean }) {
  return (
    <div
      className="rounded-md border border-transparent text-gray-900/80 transition
        group-hover/btn:border-gray-900/10 group-hover/btn:bg-gray-900/5
        group-hover/btn:text-gray-900 in-data-[current=true]:!border-transparent
        in-data-[current=true]:!bg-transparent dark:text-white/80
        dark:group-hover/btn:border-white/10 dark:group-hover/btn:bg-white/5
        dark:group-hover/btn:text-white"
    >
      {props.active && (
        <LayoutAnimated
          layoutId="active-sort-bg"
          className="absolute inset-0 rounded-md border border-blue-600/50 bg-blue-600/20"
        />
      )}
      <div
        className="@max-5xs:p-1.5 flex flex-col items-center justify-center gap-1 p-2
          in-data-[current=true]:text-blue-900 dark:in-data-[current=true]:text-blue-50"
      >
        {props.children}
      </div>
    </div>
  )
}
