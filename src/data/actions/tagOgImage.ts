import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { TagsRepo } from '../repos/tags.repo'

export class TagOgImage extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle(tagSlug: string) {
    const tag = await this.tagsRepo.bySlug(tagSlug)
    if (!tag) notFound()

    return {
      title: `Posts about ${tag.title}`,
    }
  }
}
