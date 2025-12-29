import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { config } from '../../config'
import { contentAsset } from '../cms'
import { PostsRepo } from '../repos/posts.repo'

export class ShowSimplePost extends Vla.Action {
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
