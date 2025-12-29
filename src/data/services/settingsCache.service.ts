import { Vla } from 'vla'
import { GitHubRepo } from '../repos/github.repo'
import { SettingsRepo } from '../repos/settings.repo'

export class SettingsCache extends Vla.Service {
  githubRepo = this.inject(GitHubRepo)
  settingsRepo = this.inject(SettingsRepo)

  async update() {
    const settings = await this.githubRepo.getSettings()
    if (!settings) return

    await this.settingsRepo.deleteAll()
    await this.settingsRepo.insertMany([
      { key: 'kickers', value: settings.kickers },
      { key: 'shortsAvatar', value: settings.shortsAvatar },
    ])
  }
}
