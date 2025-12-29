import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { config } from '../../config'
import { formatReadingTime } from '../../lib/formatReadingTime'
import { contentAsset } from '../cms'
import { PostsRepo } from '../repos/posts.repo'

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
