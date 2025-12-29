import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'

export class TeaseYearPosts extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(year: number | undefined) {
    const fromYear = year || (await this.latestYear()) - 1
    const posts = await this.postsRepo.listPublishedByYear(fromYear, {
      limit: 4,
    })

    if (posts.length < 1) {
      return null
    }

    const postYears = await this.postsRepo.listYears()
    const postYear = postYears.find((py) => py.year === fromYear)

    return { posts, postYear, fromYear }
  }

  private async latestYear() {
    const postYears = await this.postsRepo.listYears()
    const postYear = postYears[0]
    return postYear.year
  }
}
