import { Vla } from 'vla'
import { pluralizePosts } from '../../lib/plurals'
import { TagsRepo } from '../repos/tags.repo'

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
