import { Vla } from 'vla'
import { log as baseLog } from '@/lib/log'
import { GitHubRepo } from '../github.repo'
import { TagsRepo } from './tags.repo'

const log = baseLog.child().withContext({ module: 'data/tags' })

export class TagsCache extends Vla.Service {
  githubRepo = this.inject(GitHubRepo)
  tagsRepo = this.inject(TagsRepo)

  async cacheAll() {
    const tags = await this.githubRepo.allTags()
    await this.tagsRepo.deleteAll()
    await this.tagsRepo.insertMany(tags)
  }

  async update(slug: string) {
    const tag = await this.githubRepo.getTag(slug)
    const storedTag = await this.tagsRepo.bySlug(slug)

    if (!tag && storedTag) {
      log.withMetadata({ slug }).info('Removing record')
      await this.tagsRepo.delete(storedTag.id)
    }

    if (tag) {
      log.withMetadata({ slug }).info('Saving record')
      await this.tagsRepo.upsertBySlug(tag)
    }
  }
}
