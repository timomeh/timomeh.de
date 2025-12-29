import { Vla } from 'vla'
import { log as baseLog } from '@/lib/log'
import { GitHubRepo } from '../repos/github.repo'
import { PagesRepo } from '../repos/pages.repo'

const log = baseLog.child().withContext({ module: 'data/pages' })

export class PagesCache extends Vla.Service {
  githubRepo = this.inject(GitHubRepo)
  pagesRepo = this.inject(PagesRepo)

  async cacheAll() {
    const pages = await this.githubRepo.allPages()
    await this.pagesRepo.deleteAll()
    await this.pagesRepo.insertMany(pages)
  }

  async update(slug: string) {
    const page = await this.githubRepo.getPage(slug)
    const storedPage = await this.pagesRepo.bySlug(slug)

    if (!page && storedPage) {
      log.withMetadata({ slug }).info('Removing record')
      await this.pagesRepo.delete(storedPage.id)
    }

    if (page) {
      log.withMetadata({ slug }).info('Saving record')
      await this.pagesRepo.upsertBySlug(page)
    }
  }
}
