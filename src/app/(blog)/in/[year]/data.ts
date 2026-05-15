import { notFound } from 'next/navigation'
import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'
import { saneParseInt } from '@/lib/saneParseInt'

export class ListPostsByYear extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(year: string) {
    const safeYear = saneParseInt(year) || notFound()
    const posts = await this.postsRepo.listPublishedByYear(safeYear)
    if (posts.length < 1) notFound()

    return { posts }
  }
}
