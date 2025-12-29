import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { TagsRepo } from '../repos/tags.repo'

export class TagMetadata extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle(slug: string) {
    const tag = await this.tagsRepo.bySlug(slug)
    if (!tag) notFound()

    const metadata: Metadata = {
      title: tag.title,
      description:
        tag.metaDescription ||
        `More or less coherent thoughts about ${tag.title}.`,
      openGraph: {},
      alternates: {
        types: {
          'application/atom+xml': '/posts/feed.atom',
          'application/rss+xml': '/posts/feed.rss',
          'application/feed+json': '/posts/feed.json',
        },
      },
    }

    if (tag.metaImage && metadata.openGraph) {
      metadata.openGraph.images = [
        { url: contentAsset('tags', tag.slug, tag.metaImage) },
      ]
    }

    return metadata
  }
}
