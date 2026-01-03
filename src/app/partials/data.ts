import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { config } from '@/config'
import { contentAsset } from '@/data/cms'
import { PostsRepo } from '@/data/posts/posts.repo'
import { ShortsRepo } from '@/data/shorts/shorts.repo'

export class ShowSimplifiedPost extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)
    if (!post) notFound()

    // strip h1 but only if it isn't a link
    const contentWithoutH1 = post.content.replace(
      /^# (?!.*\[[^\]]+\]\([^)]+\)).+\n?/,
      '',
    )

    return {
      slug: post.slug,
      contentWithoutH1,
      assetPrefix: new URL(contentAsset('posts', post.slug, ''), config.siteUrl)
        .href,
    }
  }
}

export class ShowSimplifiedShort extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(id: string) {
    const short = await this.shortsRepo.byId(id)
    if (!short) notFound()

    return {
      id: short.id,
      content: short.content,
      assetPrefix: new URL(contentAsset('shorts', short.id, ''), config.siteUrl)
        .href,
    }
  }
}
