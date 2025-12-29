import { Vla } from 'vla'
import { PagesRepo } from '../repos/pages.repo'

export class GetPageKicker extends Vla.Action {
  pagesRepo = this.inject(PagesRepo)

  async handle(slug: string) {
    const page = await this.pagesRepo.bySlug(slug)
    return page?.kicker
  }
}
