import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'
import { TagsRepo } from '@/data/tags/tags.repo'

export class GetTagTitle extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle(slug: string) {
    const tag = await this.tagsRepo.bySlug(slug)

    return { title: tag?.title }
  }
}

export class GetPostYearsNav extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(year: string | undefined) {
    const postYears = await this.postsRepo.listYears()

    const activeYear = year ? Number(year) : postYears[0]?.year

    const activeYearIndex = postYears.findIndex((py) => py.year === activeYear)
    const futureYear =
      activeYearIndex > 0 ? postYears[activeYearIndex - 1]?.year : null
    const pastYear =
      activeYearIndex < postYears.length - 1
        ? postYears[activeYearIndex + 1]?.year
        : null

    const futureYearLink = futureYear
      ? postYears[0]?.year === futureYear
        ? '/'
        : `/in/${futureYear}`
      : null
    const pastYearLink = pastYear ? `/in/${pastYear}` : null

    return { activeYear, pastYearLink, futureYearLink }
  }
}
