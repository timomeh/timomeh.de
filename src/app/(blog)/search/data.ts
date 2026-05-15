import { Vla } from 'vla'

import { Search } from '@/data/search/search.service'

export class SearchPosts extends Vla.Action {
  search = this.inject(Search)

  async handle(query: string) {
    const q = query.trim()
    if (q.length < 1) return []

    const posts = await this.search.fuzzyPosts(query)
    return posts
  }
}
