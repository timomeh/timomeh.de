import { cacheLife, cacheTag } from 'next/cache'
import { Vla } from 'vla'

import { contentAsset } from '@/data/cms'
import { PostsRepo } from '@/data/posts/posts.repo'

export class ShowPostBackdrop extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)

    return {
      darkBgColor: post?.darkBgColor,
      lightBgColor: post?.lightBgColor,
      lightCover: post?.lightCover
        ? contentAsset('posts', post.slug, post.lightCover)
        : undefined,
      darkCover: post?.darkCover
        ? contentAsset('posts', post.slug, post.darkCover)
        : undefined,
    }
  }
}

export async function getCachedPostBackdrop(slug: string) {
  'use cache'
  cacheLife('days')
  cacheTag('content:posts', `content:post:${slug}`)

  return ShowPostBackdrop.invoke(slug)
}
