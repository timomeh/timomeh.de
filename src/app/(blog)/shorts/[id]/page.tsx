import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card } from '@/comps/card'
import { MDX } from '@/comps/mdx/mdx'
import { OptimImage } from '@/comps/optim-image'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getShortsAvatar } from '@/data/settings'
import { getShortById } from '@/data/shorts'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const short = await getShortById(params.id)
  if (!short) notFound()

  const avatar = await getShortsAvatar()

  return (
    <article lang={short.metaLang?.split('_')[0]} className="relative mt-2">
      <Card>
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
                <time
                  className="text-sm opacity-70"
                  dateTime={short.publishedAt.toISOString()}
                  title={short.publishedAt.toISOString()}
                >
                  <span>
                    {new Date(short.publishedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="mx-1">·</span>
                  <span>
                    {new Date(short.publishedAt).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </time>
              </Prose>
            </div>
          </div>
        </div>
      </Card>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const short = await getShortById(params.id)
  if (!short) notFound()

  const metadata: Metadata = {
    description: short.content,
    openGraph: {
      type: 'article',
      publishedTime: short.publishedAt.toISOString(),
      authors: ['Timo Mämecke'],
      locale: short.metaLang || undefined,
    },
  }

  return metadata
}
