import { Vla } from 'vla'

import { PostsRepo } from '../../../data/posts/posts.repo'

export class SearchPosts extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(query: string) {
    const q = query.trim()
    if (q.length < 1) return []

    const posts = await this.postsRepo.search(query)
    return posts
  }
}
