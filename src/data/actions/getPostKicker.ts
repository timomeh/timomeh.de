import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'

export class GetPostKicker extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)
    return post?.kicker
  }
}
