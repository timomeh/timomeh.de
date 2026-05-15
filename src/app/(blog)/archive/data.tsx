import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'

export class ListPostsGroupedByYear extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle() {
    const posts = await this.postsRepo.listPublished()
    const groupedPosts = posts.reduce(
      (acc, post) => {
        const year = new Date(post.publishedAt).getFullYear()
        const group = acc.find((g) => g.year === year)
        if (group) {
          group.posts.push(post)
        } else {
          acc.push({ year, posts: [post] })
        }
        return acc
      },
      [] as { year: number; posts: typeof posts }[],
    )

    return { groupedPosts }
  }
}
