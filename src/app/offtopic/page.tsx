import * as React from 'react'
import Link from 'next/link'

import { listOfftopics } from '@/lib/blog'
import { MDXRenderer } from '@/components/MDXRenderer'
import { Prose } from '@/components/Prose'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/20/solid'

export const generateStaticParams = () => []

export default async function Offtopics() {
  const offtopics = await listOfftopics()

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="p-2 border-violet-500 border-opacity-10 border rounded-md bg-violet-900/5 backdrop-blur-sm shadow-md shadow-violet-950/10">
        <div className="text-sm opacity-80 text-violet-300 leading-tight">
          <div className="flex space-x-2">
            <div>
              <ChatBubbleOvalLeftEllipsisIcon className="size-5" />
            </div>
            <p>
              A written stream of consciousness, where I write about whatever
              crosses my mind without overthinking it.
            </p>
          </div>
        </div>
      </div>
      <div className="h-6" />
      <div className="sm:grid grid-cols-[max-content_auto] gap-x-3">
        {offtopics.map((offtopic) => (
          <article
            lang={offtopic.meta.lang.split('_')[0]}
            key={offtopic.number}
            className="col-span-2 grid grid-cols-subgrid mt-2"
          >
            <time className="text-xs uppercase font-bold sm:text-right sm:mt-1">
              <Link
                className="opacity-50 hover:opacity-80 transition-opacity"
                href={`/offtopic/${offtopic.slug}`}
              >
                {offtopic.postedAt.toLocaleString('en-US', {
                  dateStyle: 'medium',
                })}
              </Link>
            </time>
            <div className="border-b border-opacity-5 border-white pb-2">
              <h2 className="leading-snug transition-all font-semibold font-display">
                <Link href={`/offtopic/${offtopic.slug}`} className="glow">
                  <MDXRenderer content={offtopic.title!} inline />
                </Link>
              </h2>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'Offtopic',
    description: "I think things and just write 'em down.",
    alternates: {
      types: {
        'application/atom+xml': '/offtopic/feed.atom',
        'application/rss+xml': '/offtopic/feed.rss',
        'application/feed+json': '/offtopic/feed.json',
      },
    },
  }
}
