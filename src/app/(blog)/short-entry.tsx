import Link from 'next/link'

import { ListedShort } from '@/app/(blog)/data'
import { MDX } from '@/comps/mdx/mdx'
import { MediaGrid } from '@/comps/media-grid'
import { OptimImage } from '@/comps/optim-image'
import { Prose } from '@/comps/prose'
import { formatRelativeDate } from '@/lib/date'

export function ShortEntry({
  short,
  linkTo,
}: {
  short: Omit<ListedShort, 'type'>
  linkTo: 'detail' | 'list'
}) {
  return (
    <div className="flex">
      <OptimImage
        src={short.avatar}
        quality={80}
        width={40}
        height={40}
        alt="Timo’s avatar"
        className="mr-3 size-6 rounded-full md:mr-4 md:size-10"
      />
      <div className="min-w-0 [&_p]:first-of-type:mt-0">
        <div className="mb-1 flex flex-nowrap items-baseline gap-x-3 gap-y-1">
          <span className="font-bold">Timo</span>
          <Link
            id={`short-${short.id}`}
            href={
              linkTo === 'detail'
                ? `/shorts/${short.id}`
                : `/shorts#short-${short.id}`
            }
            className="
                font-mono text-sm font-medium text-current/60
                hover:underline
                md:text-xs
              "
          >
            <time dateTime={short.publishedAt.toISOString()}>
              {formatRelativeDate(short.publishedAt)}
            </time>
          </Link>
        </div>
        <Prose size="sm">
          <MDX
            cacheTags={['mdx-type:short', `mdx-short:${short.id}`]}
            cacheKey={`short-${short.id}`}
            assetPrefix={short.assetPrefix}
            content={short.content || ''}
            scope={short.id}
          />
        </Prose>
        {!!short.attachments && short.attachments.length > 0 && (
          <div className="mt-4 mb-4">
            <MediaGrid images={short.attachments} shortId={short.id} />
          </div>
        )}
      </div>
    </div>
  )
}
