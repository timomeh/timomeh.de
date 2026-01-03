import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { PostsRepo } from '@/data/posts/posts.repo'
import { ShortsService } from '@/data/shorts/shorts.service'
import { TagsRepo } from '@/data/tags/tags.repo'
import { groupPosts } from '@/lib/groupPosts'

export class ListPostsByTag extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)

  async handle(tagSlug: string, sort: 'asc' | 'desc') {
    const tag = await this.tagsRepo.bySlug(tagSlug)
    if (!tag) notFound()

    const posts = await this.postsRepo.listPublishedByTag(tag.id, { sort })
    return { tag, posts }
  }
}

export class ShowListedPost extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    return this.postsRepo.bySlug(slug)
  }
}

export class ListPostsByYear extends Vla.Action {
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

export class ListPostsForCurrentYear extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)
  shortsService = this.inject(ShortsService)

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
    const shorts = await this.shortsService.listEnriched(3)

    const hasShorts = shorts.length > 0
    const shortsAtTop =
      sort === 'asc' ? false : shorts[0]?.publishedAt > posts[0]?.publishedAt

    return { groupedPosts, shortsAtTop, hasShorts, shorts }
  }
}

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
