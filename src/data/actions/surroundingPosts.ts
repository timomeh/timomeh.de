import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'

export class SurroundingPosts extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(currentPostSlug: string) {
    const [newerPost, olderPost] = await Promise.all([
      this.postsRepo.findNewer(currentPostSlug),
      this.postsRepo.findOlder(currentPostSlug),
    ])

    return { newerPost, olderPost }
  }
}
