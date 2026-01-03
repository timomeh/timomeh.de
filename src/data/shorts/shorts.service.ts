import { Vla } from 'vla'
import { contentAsset } from '../cms'
import { GitHubRepo } from '../github.repo'
import { SettingsRepo } from '../settings/settings.repo'
import { type Short, ShortsRepo } from './shorts.repo'

export type EnrichedShort = Short & {
  avatar: string
  assetPrefix: string
}

export class ShortsService extends Vla.Service {
  githubRepo = this.inject(GitHubRepo)
  shortsRepo = this.inject(ShortsRepo)
  settingsRepo = this.inject(SettingsRepo)

  async listEnriched(limit?: number) {
    const shorts = await this.shortsRepo.list({ limit })
    const avatar = await this.settingsRepo.getShortsAvatar()
    const enrichedShorts: EnrichedShort[] = shorts.map((short) => ({
      ...short,
      avatar,
      assetPrefix: contentAsset('shorts', short.id, ''),
    }))

    return enrichedShorts
  }

  async getEnriched(id: string) {
    const short = await this.shortsRepo.byId(id)
    if (!short) return null

    const avatar = await this.settingsRepo.getShortsAvatar()

    const enrichedShort: EnrichedShort = {
      ...short,
      avatar,
      assetPrefix: contentAsset('shorts', id, ''),
    }
    return enrichedShort
  }
}
