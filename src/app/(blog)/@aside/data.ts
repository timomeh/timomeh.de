import { Vla } from 'vla'
import { PostsRepo } from '@/data/posts/posts.repo'
import { TagsRepo } from '@/data/tags/tags.repo'

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

export class ListSidebarTags extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle() {
    const tags = await this.tagsRepo.list()
    const MAX_TAGS = 14
    return tags.slice(0, MAX_TAGS)
  }
}

export class ListSidebarPostTags extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(currentPostSlug: string) {
    const post = await this.postsRepo.bySlug(currentPostSlug)
    if (!post) return null
    return post.postTags
  }
}

export class GetSidebarPostNav extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(currentPostSlug: string) {
    const [newerPost, olderPost] = await Promise.all([
      this.postsRepo.findNewer(currentPostSlug),
      this.postsRepo.findOlder(currentPostSlug),
    ])

    return { newerPost, olderPost }
  }
}
