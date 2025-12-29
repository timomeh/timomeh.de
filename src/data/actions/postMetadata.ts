import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { PostsRepo } from '../repos/posts.repo'

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
