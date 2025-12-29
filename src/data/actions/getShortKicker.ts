import { Vla } from 'vla'
import { ShortsRepo } from '../repos/shorts.repo'

export class GetShortKicker extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(id: string) {
    const short = await this.shortsRepo.byId(id)
    return short?.kicker
  }
}
