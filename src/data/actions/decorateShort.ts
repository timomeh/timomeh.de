import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { SettingsRepo } from '../repos/settings.repo'

export class DecorateShort extends Vla.Action {
  settingsRepo = this.inject(SettingsRepo)

  async handle(id: string) {
    const avatar = await this.settingsRepo.getShortsAvatar()
    return { avatar, assetPrefix: contentAsset('shorts', id, '') }
  }
}
