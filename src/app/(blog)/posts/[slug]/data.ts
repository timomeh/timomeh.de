import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { config } from '@/config'
import { contentAsset } from '@/data/cms'
import { PostsRepo } from '@/data/posts/posts.repo'
import { formatReadingTime } from '@/lib/formatReadingTime'

export class ShowPost extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)
    if (!post) notFound()
    return { post, assetPrefix: contentAsset('posts', post.slug, '') }
  }
}

export class PostOgImage extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(postSlug: string) {
    const post = await this.postsRepo.bySlug(postSlug)
    if (!post) notFound()

    const cover = post.darkCover
      ? new URL(
          contentAsset('posts', post.slug, post.darkCover),
          config.siteUrl,
        ).href
      : undefined

    return {
      title: post.title,
      cover,
      date: post.publishedAt,
      est: formatReadingTime(post.content, post.readingTime, 'read'),
    }
  }
}

export class PostMetadata extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)
    if (!post) notFound()

    const metadata: Metadata = {
      title: post.title,
      description: post.metaDescription,
      openGraph: {
        type: 'article',
        description: post.metaDescription || undefined,
        publishedTime: post.publishedAt.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: ['Timo Mämecke'],
        locale: post.metaLang || undefined,
      },
      alternates: {
        types: {
          'application/atom+xml': '/posts/feed.atom',
          'application/rss+xml': '/posts/feed.rss',
          'application/feed+json': '/posts/feed.json',
        },
      },
    }

    if (post.metaImage && metadata.openGraph) {
      metadata.openGraph.images = [
        { url: contentAsset('posts', post.slug, post.metaImage) },
      ]
    }

    return metadata
  }
}
