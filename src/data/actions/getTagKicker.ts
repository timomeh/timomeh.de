import { Vla } from 'vla'
import { TagsRepo } from '../repos/tags.repo'

export class GetTagKicker extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle(slug: string) {
    const tag = await this.tagsRepo.bySlug(slug)
    return tag?.kicker
  }
}
