import { Vla } from 'vla'
import { ShortsRepo } from '../repos/shorts.repo'

export class ListShorts extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle() {
    const shorts = await this.shortsRepo.list()
    return shorts
  }
}
