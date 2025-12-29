import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { PagesRepo } from '../repos/pages.repo'

export class PageMetadata extends Vla.Action {
  pagesRepo = this.inject(PagesRepo)

  async handle(slug: string) {
    const page = await this.pagesRepo.bySlug(slug)
    if (!page) notFound()

    const metadata: Metadata = {
      title: page.title,
      description: page.metaDescription,
      openGraph: {},
    }

    if (page.metaImage && metadata.openGraph) {
      metadata.openGraph.images = [
        { url: contentAsset('pages', page.slug, page.metaImage) },
      ]
    }

    return metadata
  }
}
