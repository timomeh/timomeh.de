import Link from 'next/link'
import { Card } from '@/comps/card'
import { MDX } from '@/comps/mdx/mdx'
import { OptimImage } from '@/comps/optim-image'
import { Prose } from '@/comps/prose'
import { contentAsset, type Short } from '@/data/cms'
import { getShortsAvatar } from '@/data/settings'
import { formatRelativeDate } from '@/lib/date'

type Prop = {
  shorts: Short[]
}

export async function ShortsTimeline({ shorts }: Prop) {
  const avatar = await getShortsAvatar()

  return (
    <Card>
      <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
        {shorts.map((short) => (
          <div className="p-4 sm:p-6 md:p-8" key={short.id}>
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
                  <Link href={`/shorts/${short.id}`} className="not-prose">
                    <div className="text-sm -mt-0.5">
                      <span className="font-bold inline-block mr-1">Timo</span>
                      <span className="inline-block opacity-70">@timomeh</span>
                      <span className="inline-block mx-1 opacity-70">·</span>
                      <time
                        className="inline-block opacity-70"
                        dateTime={short.publishedAt.toISOString()}
                        title={short.publishedAt.toISOString()}
                      >
                        {formatRelativeDate(short.publishedAt)}
                      </time>
                    </div>
                  </Link>
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
          </div>
        ))}
      </div>
    </Card>
  )
}
