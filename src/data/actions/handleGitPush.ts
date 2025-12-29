import { revalidatePath, revalidateTag } from 'next/cache'
import { Vla } from 'vla'
import { log as baseLog } from '@/lib/log'
import { PagesCache } from '../services/pagesCache.service'
import { PostsCache } from '../services/postsCache.service'
import { PostTagsCache } from '../services/postTagsCache.service'
import { SettingsCache } from '../services/settingsCache.service'
import { ShortsCache } from '../services/shortsCache.service'
import { TagsCache } from '../services/tagsCache.service'

const log = baseLog.child().withContext({ module: 'webhooks/github' })

export class HandleGitPush extends Vla.Action {
  postsCache = this.inject(PostsCache)
  pagesCache = this.inject(PagesCache)
  postTagsCache = this.inject(PostTagsCache)
  tagsCache = this.inject(TagsCache)
  shortsCache = this.inject(ShortsCache)
  settingsCache = this.inject(SettingsCache)

  async handle(changedFiles: string[]) {
    await Promise.allSettled(
      changedFiles.map(async (file) => {
        const [resource, slug] = file.split('/')

        if (resource === 'posts') {
          await this.postsCache.update(slug)
          await this.postTagsCache.updateByPost(slug)
          revalidateTag(`feed-pre:${slug}`, 'max')
          revalidateTag(`mdx-post:${slug}`, 'max')
          revalidatePath('/tags') // also update tags to update the post count
          log.withMetadata({ resource, slug }).info('Updated cache')
          return
        }

        if (resource === 'pages') {
          await this.pagesCache.update(slug)
          revalidateTag(`mdx-page:${slug}`, 'max')
          log.withMetadata({ resource, slug }).info('Updated cache')
          return
        }

        if (resource === 'tags') {
          await this.tagsCache.update(slug)
          revalidatePath('/tags')
          log.withMetadata({ resource, slug }).info('Updated cache')
          return
        }

        if (resource === 'shorts') {
          await this.shortsCache.update(slug)
          revalidateTag(`mdx-short:${slug}`, 'max')
          log.withMetadata({ resource, slug }).info('Updated cache')
          return
        }

        if (resource === 'settings') {
          await this.settingsCache.update()
          log.withMetadata({ resource, slug }).info('Updated cache')
          return
        }

        log.debug(`Nothing to update for ${file}`)
      }),
    )
  }
}
