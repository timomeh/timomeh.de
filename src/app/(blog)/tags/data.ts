import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'

import { contentAsset } from '@/data/cms'
import { PostsRepo } from '@/data/posts/posts.repo'
import { TagsRepo } from '@/data/tags/tags.repo'

export class ListAllTags extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle() {
    const tags = await this.tagsRepo.list()

    return tags.map((tag) => ({
      slug: tag.slug,
      title: tag.title,
      color: tag.color,
      postCount: tag.postCount,
    }))
  }
}

export type TagListedPost = Awaited<
  ReturnType<PostsRepo['listPublishedByTag']>
>[0]

export class ListPostsByTag extends Vla.Action {
  postsRepo = this.inject(PostsRepo)
  tagsRepo = this.inject(TagsRepo)

  async handle(slug: string) {
    const tag = await this.tagsRepo.bySlug(slug)
    if (!tag) notFound()

    const posts = await this.postsRepo.listPublishedByTag(tag.id)

    return { posts, tag }
  }
}

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
        tag.description ||
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
