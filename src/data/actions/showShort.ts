import { notFound } from 'next/navigation'
import { Vla } from 'vla'
import { ShortsRepo } from '../repos/shorts.repo'

export class ShowShort extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(id: string) {
    const short = await this.shortsRepo.byId(id)
    if (!short) notFound()
    return { short }
  }
}
