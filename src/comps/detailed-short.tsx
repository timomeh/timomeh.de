import { contentAsset } from '@/data/cms'
import { getShortsAvatar } from '@/data/settings'
import type { Short } from '@/data/shorts'
import { LocalDateTime } from './local-date-time'
import { MDX } from './mdx/mdx'
import { MediaGrid } from './media-grid'
import { OptimImage } from './optim-image'
import { Prose } from './prose'

type Props = {
  short: Short
}

export async function DetailedShort({ short }: Props) {
  const avatar = await getShortsAvatar()

  return (
    <div className="flex">
      <OptimImage
        src={avatar}
        quality={80}
        width={40}
        height={40}
        alt="Timo’s avatar"
        className="size-6 mr-2 md:size-10 rounded-full md:mr-4"
      />
      <div className="[&_p]:first-of-type:mt-0">
        <Prose size="sm">
          <div className="text-sm -mt-0.5 not-prose">
            <span className="font-bold inline-block mr-1">Timo</span>
            <span className="inline-block opacity-70">@timomeh</span>
          </div>
          <MDX
            cacheTags={['mdx-type:short', `mdx-short:${short.id}`]}
            cacheKey={`short-${short.id}`}
            assetPrefix={contentAsset('shorts', short.id, '')}
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
