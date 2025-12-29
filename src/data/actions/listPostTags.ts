import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'

export class ListPostTags extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(currentPostSlug: string) {
    const post = await this.postsRepo.bySlug(currentPostSlug)
    if (!post) return null
    return post.postTags
  }
}
