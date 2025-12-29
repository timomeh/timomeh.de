import { Vla } from 'vla'
import { sample } from '../../lib/sample'
import { SettingsRepo } from '../repos/settings.repo'

export class RandomDefaultKicker extends Vla.Action {
  settingsRepo = this.inject(SettingsRepo)

  async handle() {
    const kickers = await this.settingsRepo.getDefaultKickers()
    const fallback = 'a head full of milk foam by'
    const kicker = kickers.length > 0 ? sample(kickers) : fallback

    return kicker
  }
}
