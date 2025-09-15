import Link from 'next/link'
import { getShortsAvatar } from '@/data/settings'
import type { Short } from '@/data/shorts'
import { contentAsset } from '../data/cms'
import { formatRelativeDate, isMoreThanWeeksAgo } from '../lib/date'
import { LocalDateTime } from './local-date-time'
import { MDX } from './mdx/mdx'
import { OptimImage } from './optim-image'
import { Prose } from './prose'

type Props = {
  short: Short
}

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
        className="size-10 rounded-full mr-4"
      />
      <div className="[&_p]:first-of-type:mt-0">
        <Prose>
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
        </Prose>
      </div>
    </div>
  )
}
