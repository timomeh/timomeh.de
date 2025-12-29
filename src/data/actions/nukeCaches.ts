import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { Vla } from 'vla'
import { log as baseLog } from '@/lib/log'
import { PostsRepo } from '../repos/posts.repo'
import { PagesCache } from '../services/pagesCache.service'
import { PostsCache } from '../services/postsCache.service'
import { PostTagsCache } from '../services/postTagsCache.service'
import { SettingsCache } from '../services/settingsCache.service'
import { ShortsCache } from '../services/shortsCache.service'
import { TagsCache } from '../services/tagsCache.service'

const log = baseLog.child().withContext({ module: 'webhooks/nuke' })

export class NukeCaches extends Vla.Action {
  postsRepo = this.inject(PostsRepo)
  postsCache = this.inject(PostsCache)
  pagesCache = this.inject(PagesCache)
  postTagsCache = this.inject(PostTagsCache)
  tagsCache = this.inject(TagsCache)
  shortsCache = this.inject(ShortsCache)
  settingsCache = this.inject(SettingsCache)

  async handle({ soft }: { soft?: boolean }) {
    if (soft) {
      const existingPosts = await this.postsRepo.listPublished()
      if (existingPosts.length > 0) {
        log.info(
          'It looks like we have cached data. Not nuking because soft is used',
        )

        revalidateTag('mdx', 'max')

        return NextResponse.json({
          revalidated: false,
          now: Date.now(),
        })
      }
    }

    log.info('Nuking all caches...')

    await this.pagesCache.cacheAll()
    await this.shortsCache.cacheAll()
    await this.postsCache.cacheAll()
    await this.tagsCache.cacheAll()
    await this.postTagsCache.cacheAll()
    await this.settingsCache.update()

    revalidateTag('feed-pre', 'max')
    revalidateTag('mdx', 'max')
    revalidatePath('/tags')
    revalidatePath('/posts/[slug]', 'page')
    revalidatePath('/[page]', 'page')

    log.info('Successfully nuked all caches')

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    })
  }
}
