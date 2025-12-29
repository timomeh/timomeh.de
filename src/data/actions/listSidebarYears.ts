import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'

export class ListSidebarYears extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(
    currentYear: string | undefined,
    currentTag: string | undefined,
  ) {
    const postYears = await this.postsRepo.listYears()

    const activeYear = currentYear
      ? Number(currentYear)
      : currentTag
        ? null
        : postYears[0]?.year

    return { activeYear, postYears }
  }
}
