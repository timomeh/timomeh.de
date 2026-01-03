import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { contentAsset } from '@/data/cms'
import { TagsRepo } from '@/data/tags/tags.repo'

export class TagOgImage extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle(tagSlug: string) {
    const tag = await this.tagsRepo.bySlug(tagSlug)
    if (!tag) notFound()

    return {
      title: `Posts about ${tag.title}`,
    }
  }
}

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
