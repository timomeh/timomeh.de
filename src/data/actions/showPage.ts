import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { PagesRepo } from '../repos/pages.repo'

export class ShowPage extends Vla.Action {
  pagesRepo = this.inject(PagesRepo)

  async handle(slug: string) {
    const page = await this.pagesRepo.bySlug(slug)
    if (!page) notFound()
    return { page, assetPrefix: contentAsset('pages', page.slug, '') }
  }
}
