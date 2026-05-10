import { notFound } from 'next/navigation'
import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'
import { TagsRepo } from '@/data/tags/tags.repo'

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
  postsRepo = this.inject(PostsRepo)

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

    return { posts }
  }
}

export class TeaseYearPosts extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(year: number | undefined) {
    const fromYear = year || (await this.latestYear()) - 1
    const posts = await this.postsRepo.listPublishedByYear(fromYear, {
      limit: 7,
    })

    if (posts.length < 1) {
      return null
    }

    const postYears = await this.postsRepo.listYears()
    const postYear = postYears.find((py) => py.year === fromYear)
    const moreCount = postYear ? String(postYear.count - 7) : ''

    return { posts, postYear, fromYear, moreCount }
  }

  private async latestYear() {
    const postYears = await this.postsRepo.listYears()
    const postYear = postYears[0]
    return postYear.year
  }
}
