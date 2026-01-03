import { Vla } from 'vla'
import { log as baseLog } from '@/lib/log'
import { GitHubRepo } from '../github.repo'
import { ShortsRepo } from './shorts.repo'

const log = baseLog.child().withContext({ module: 'data/shorts' })

export class ShortsCache extends Vla.Service {
  githubRepo = this.inject(GitHubRepo)
  shortsRepo = this.inject(ShortsRepo)

  async cacheAll() {
    const shorts = await this.githubRepo.allShorts()
    await this.shortsRepo.deleteAll()
    await this.shortsRepo.insertMany(shorts)
  }

  async update(id: string) {
    const short = await this.githubRepo.getShort(id)
    const storedShort = await this.shortsRepo.byId(id)

    if (!short && storedShort) {
      log.withMetadata({ id }).info('Removing record')
      await this.shortsRepo.delete(storedShort.id)
    }

    if (short) {
      log.withMetadata({ id }).info('Saving record')
      await this.shortsRepo.upsertById(short)
    }
  }
}
