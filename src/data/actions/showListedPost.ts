import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'

export class ShowListedPost extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    return this.postsRepo.bySlug(slug)
  }
}
