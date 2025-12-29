import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { stripMarkdown } from '../../lib/markdown'
import { metaTitle } from '../../lib/metaTitle'
import { ShortsRepo } from '../repos/shorts.repo'

export class ShortMetadata extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(id: string) {
    const short = await this.shortsRepo.byId(id)
    if (!short) notFound()

    const metadata: Metadata = {
      title: short.content
        ? metaTitle(stripMarkdown(short.content))
        : 'Timo thinks…',
      description: short.content,
      openGraph: {
        type: 'article',
        publishedTime: short.publishedAt.toISOString(),
        authors: ['Timo Mämecke'],
        locale: short.metaLang || undefined,
      },
      alternates: {
        types: {
          'application/atom+xml': '/shorts/feed.atom',
          'application/rss+xml': '/shorts/feed.rss',
          'application/feed+json': '/shorts/feed.json',
        },
      },
    }

    return metadata
  }
}
