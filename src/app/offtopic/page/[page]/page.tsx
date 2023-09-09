import * as React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { listOfftopicsPaginated } from '@/lib/blog'
import { ListedOfftopic } from '../../ListedOfftopic'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: { page: string }
}

export default async function Offtopics({ params }: Props) {
  const page = +params.page
  if (!Number.isInteger(page)) notFound()

  const { offtopics, prev, next } = await listOfftopicsPaginated(page)
  if (offtopics.length < 1) notFound()

  return (
    <>
      <div className="space-y-10">
        {offtopics.map((offtopic, i) => (
          <React.Fragment key={offtopic.number}>
            <ListedOfftopic offtopic={offtopic} />
            {i < offtopics.length - 1 && (
              <div
                className="pl-1 font-display text-4xl leading-none font-medium text-violet-500/50"
                aria-hidden={true}
              >
                ~
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-10 flex space-x-4 max-w-content px-4 justify-center text-[13px] font-bold uppercase">
        {prev && (
          <Link
            className="underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
            href={prev === 1 ? `/` : `/offtopic/page/${prev}`}
          >
            Newer
          </Link>
        )}
        {next && (
          <Link
            className="justify-self-start underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
            href={`/offtopic/page/${next}`}
          >
            Older
          </Link>
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  let title = 'Offtopic'
  const page = +params.page
  if (page > 1) title += ` - Page ${page}`

  return {
    title: page > 1 ? title : undefined,
    description: "I think things and just write 'em down.",
    alternates: {
      canonical: page === 1 ? 'https://timomeh.de/' : undefined,
      types: {
        'application/atom+xml': '/offtopic/feed.atom',
        'application/rss+xml': '/offtopic/feed.rss',
        'application/feed+json': '/offtopic/feed.json',
      },
    },
  }
}
