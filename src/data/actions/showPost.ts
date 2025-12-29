import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { PostsRepo } from '../repos/posts.repo'

export class ShowPost extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)
    if (!post) notFound()
    return { post, assetPrefix: contentAsset('posts', post.slug, '') }
  }
}
