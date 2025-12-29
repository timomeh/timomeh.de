import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { config } from '../../config'
import { contentAsset } from '../cms'
import { ShortsRepo } from '../repos/shorts.repo'

export class ShowSimpleShort extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(id: string) {
    const short = await this.shortsRepo.byId(id)
    if (!short) notFound()

    return {
      id: short.id,
      content: short.content,
      assetPrefix: new URL(contentAsset('shorts', short.id, ''), config.siteUrl)
        .href,
    }
  }
}
