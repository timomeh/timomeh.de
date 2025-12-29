import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'
import { TagsRepo } from '../repos/tags.repo'

export class ListTaggedPosts extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)

  async handle(tagSlug: string, sort: 'asc' | 'desc') {
    const tag = await this.tagsRepo.bySlug(tagSlug)
    if (!tag) notFound()

    const posts = await this.postsRepo.listPublishedByTag(tag.id, { sort })
    return { tag, posts }
  }
}
