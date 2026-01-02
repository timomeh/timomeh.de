import { Vla } from 'vla'
import { groupPosts } from '../../lib/groupPosts'
import { PostsRepo } from '../repos/posts.repo'
import { ShortsRepo } from '../repos/shorts.repo'
import { TagsRepo } from '../repos/tags.repo'

export class ListLatestYearPosts extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)
  shortsRepo = this.inject(ShortsRepo)

  async handle(sort: 'asc' | 'desc') {
    const postYears = await this.postsRepo.listYears()
    const postYear = postYears[0]
    const posts = postYear
      ? await this.postsRepo.listPublishedByYear(postYear.year, { sort })
      : []

    const MIN_POSTS_TO_DISPLAY = 7

    if (posts.length < MIN_POSTS_TO_DISPLAY) {
      const lastYearPosts = await this.postsRepo.listPublishedByYear(
        postYear.year - 1,
        {
          sort,
          limit: Math.max(2, MIN_POSTS_TO_DISPLAY - posts.length),
        },
      )
      posts.push(...lastYearPosts)
    }

    const groupedPosts = groupPosts(posts)
    const shorts = await this.shortsRepo.list({ limit: 2 })

    const hasShorts = shorts.length > 0
    const shortsAtTop =
      sort === 'asc' ? false : shorts[0]?.publishedAt > posts[0]?.publishedAt

    return { groupedPosts, shortsAtTop, hasShorts, shorts }
  }
}
