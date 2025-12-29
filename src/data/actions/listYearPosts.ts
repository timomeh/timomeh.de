import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'
import { TagsRepo } from '../repos/tags.repo'

export class ListYearPosts extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)

  async handle(year: number, sort: 'asc' | 'desc') {
    const postYears = await this.postsRepo.listYears()
    const postYear = postYears.find((postYear) => postYear.year === year)
    if (!postYear) notFound()

    const posts = await this.postsRepo.listPublishedByYear(postYear.year, {
      sort,
    })
    return { postYear, posts }
  }
}
