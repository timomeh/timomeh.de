import { Vla } from 'vla'
import { TagsRepo } from '@/data/tags/tags.repo'
import { pluralizePosts } from '@/lib/plurals'

export class ListAllTags extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle() {
    const tags = await this.tagsRepo.list()

    return tags.map((tag) => ({
      slug: tag.slug,
      titleAndCount: `${tag.title} (${pluralizePosts(tag.postCount)})`,
    }))
  }
}
