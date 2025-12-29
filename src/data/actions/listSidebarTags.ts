import { Vla } from 'vla'
import { TagsRepo } from '../repos/tags.repo'

export class ListSidebarTags extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle() {
    const tags = await this.tagsRepo.list()
    const MAX_TAGS = 14
    return tags.slice(0, MAX_TAGS)
  }
}
