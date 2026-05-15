import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'
import { PostsSearchRepo } from '@/data/search/postsSearch.repo'

export class Search extends Vla.Service {
  postsRepo = this.inject(PostsRepo)
  postsSearchRepo = this.inject(PostsSearchRepo)

  async reindex() {
    const freshPosts = await this.postsRepo.all.fresh()
    await this.postsSearchRepo.deleteAll()
    await Promise.all(
      freshPosts.map((post) => this.postsSearchRepo.insert(post)),
    )
  }

  async fuzzyPosts(query: string) {
    const rows = await this.postsSearchRepo.list(query)
    const ids = rows.map((row) => row.id)
    const posts = await this.postsRepo.listPublishedByIds(ids)

    // restore order
    const order = new Map(rows.map((r, i) => [r.id, i]))
    const rankedResults = posts.sort(
      (a, b) => order.get(a.id)! - order.get(b.id)!,
    )

    return rankedResults
  }
}
