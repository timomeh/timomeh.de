import Link from 'next/link'
import { getShortsAvatar } from '@/data/settings'
import type { Short } from '@/data/shorts'
import { contentAsset } from '../data/cms'
import { formatRelativeDate, isMoreThanWeeksAgo } from '../lib/date'
import { LocalDateTime } from './local-date-time'
import { MDX } from './mdx/mdx'
import { MediaGrid } from './media-grid'
import { OptimImage } from './optim-image'
import { Prose } from './prose'

type Props = {
  short: Short
}

// TODO: would be cool to only show e.g. max 2 images here and cut more images
// off with a "+3 more" overlay

export async function ListedShort({ short }: Props) {
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
          <div className="text-sm -mt-0.5">
            <Link href={`/shorts/${short.id}`} className="not-prose">
              <span className="font-bold inline-block mr-1">Timo</span>
              <span className="inline-block opacity-70">@timomeh</span>
              <span className="inline-block mx-1 opacity-70">·</span>
              <time
                className="inline-block opacity-70"
                dateTime={short.publishedAt.toISOString()}
                title={short.publishedAt.toISOString()}
              >
                {isMoreThanWeeksAgo(short.publishedAt, 10) ? (
                  <LocalDateTime
                    utc={short.publishedAt.toISOString()}
                    showTime={false}
                  />
                ) : (
                  formatRelativeDate(short.publishedAt)
                )}
              </time>
            </Link>
          </div>
          <MDX
            cacheTags={['mdx-type:short', `mdx-short:${short.id}`]}
            cacheKey={`short-${short.id}`}
            assetPrefix={contentAsset('shorts', short.id, '')}
            content={short.content || ''}
            scope={short.id}
          />
          {!!short.attachments && short.attachments.length > 0 && (
            <div className="not-prose mb-4">
              <MediaGrid images={short.attachments} shortId={short.id} />
            </div>
          )}
        </Prose>
      </div>
    </div>
  )
}
