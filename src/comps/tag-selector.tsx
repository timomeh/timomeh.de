import clsx from 'clsx'
import Link from 'next/link'

import { Tag } from './tag'

const tags = [
  ['Software Engineering', 'rgb(5, 150, 105)'],
  ['Travel', 'rgb(202, 138, 4)'],
  ['Random', 'rgb(219, 39, 119)'],
  ['Music', 'rgb(79, 70, 229)'],
]

type Props = {
  activeTag: number
}

export function TagSelector({ activeTag }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={clsx(
          `ease-linear [transition:opacity_300ms,transform_60ms] hover:!opacity-100
          motion-safe:active:scale-[.97]`,
          0 !== activeTag && 'opacity-75',
        )}
      >
        <Tag
          color="rgb(156, 163, 175)"
          name="Everything"
          highlight={0 === activeTag}
          clickable
        />
      </Link>
      {tags.map(([name, color], i) => (
        <Link
          key={i + 1}
          href={`/tag/${i + 1}`}
          className={clsx(
            `ease-linear [transition:opacity_300ms,transform_60ms] hover:!opacity-100
            motion-safe:active:scale-[.97]`,
            i + 1 !== activeTag && 'opacity-75',
          )}
        >
          <Tag
            color={color}
            name={name}
            highlight={i + 1 === activeTag}
            clickable
          />
        </Link>
      ))}
    </div>
  )
}
