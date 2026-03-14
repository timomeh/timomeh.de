import type { EnrichedShort } from '@/data/shorts/shorts.service'

import { LocalDateTime } from './local-date-time'
import { MDX } from './mdx/mdx'
import { MediaGrid } from './media-grid'
import { OptimImage } from './optim-image'
import { Prose } from './prose'

type Props = {
  short: EnrichedShort
}

export async function DetailedShort({ short }: Props) {
  return (
    <div className="flex">
      <OptimImage
        src={short.avatar}
        quality={80}
        width={40}
        height={40}
        alt="Timo’s avatar"
        className="mr-2 size-6 rounded-full md:mr-4 md:size-10"
      />
      <div className="min-w-0 [&_p]:first-of-type:mt-0">
        <Prose size="sm">
          <div className="not-prose -mt-0.5 text-sm">
            <span className="mr-1 inline-block font-bold">Timo</span>
            <span className="inline-block opacity-70">@timomeh</span>
          </div>
          <MDX
            cacheTags={['mdx-type:short', `mdx-short:${short.id}`]}
            cacheKey={`short-${short.id}`}
            assetPrefix={short.assetPrefix}
            content={short.content || ''}
          />
          {!!short.attachments && short.attachments.length > 0 && (
            <div className="not-prose mb-4">
              <MediaGrid images={short.attachments} shortId={short.id} />
            </div>
          )}
          <time
            className="text-sm opacity-70"
            dateTime={short.publishedAt.toISOString()}
            title={short.publishedAt.toISOString()}
          >
            <LocalDateTime utc={short.publishedAt.toISOString()} />
          </time>
        </Prose>
      </div>
    </div>
  )
}
