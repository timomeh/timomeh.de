import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { Vla } from 'vla'

import { PagesCache } from '@/data/pages/pagesCache.service'
import { PostsRepo } from '@/data/posts/posts.repo'
import { PostsCache } from '@/data/posts/postsCache.service'
import { PostTagsCache } from '@/data/postTags/postTagsCache.service'
import { Search } from '@/data/search/search.service'
import { SettingsCache } from '@/data/settings/settingsCache.service'
import { ShortsCache } from '@/data/shorts/shortsCache.service'
import { TagsCache } from '@/data/tags/tagsCache.service'
import { log as baseLog } from '@/lib/log'
import { sleep } from '@/lib/sleep'

const log = baseLog.child().withContext({ module: 'webhooks/nuke' })

export class NukeCaches extends Vla.Action {
  postsRepo = this.inject(PostsRepo)
  postsCache = this.inject(PostsCache)
  pagesCache = this.inject(PagesCache)
  postTagsCache = this.inject(PostTagsCache)
  tagsCache = this.inject(TagsCache)
  shortsCache = this.inject(ShortsCache)
  settingsCache = this.inject(SettingsCache)
  search = this.inject(Search)

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
    log.info('✅ Nuked pages cache')

    await sleep(1_000)

    await this.shortsCache.cacheAll()
    log.info('✅ Nuked shorts cache')

    await sleep(1_000)

    await this.postsCache.cacheAll()
    log.info('✅ Nuked posts cache')

    await sleep(1_000)

    await this.tagsCache.cacheAll()
    log.info('✅ Nuked tags cache')

    await sleep(1_000)

    await this.postTagsCache.cacheAll()
    log.info('✅ Nuked postTags cache')

    await sleep(1_000)

    await this.settingsCache.update()
    log.info('✅ Nuked settings cache')

    await sleep(1_000)

    await this.search.reindex()
    log.info('✅ Reindexed search')

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

export class UpdateChangedFiles extends Vla.Action {
  postsCache = this.inject(PostsCache)
  pagesCache = this.inject(PagesCache)
  postTagsCache = this.inject(PostTagsCache)
  tagsCache = this.inject(TagsCache)
  shortsCache = this.inject(ShortsCache)
  settingsCache = this.inject(SettingsCache)
  search = this.inject(Search)

  async handle(changedFiles: string[]) {
    const reindexPostSlugs: string[] = []
    const reindexTagSlugs: string[] = []

    await Promise.allSettled(
      changedFiles.map(async (file) => {
        const [resource, slug] = file.split('/')

        if (resource === 'posts') {
          await this.postsCache.update(slug)
          await this.postTagsCache.updateByPost(slug)
          reindexPostSlugs.push(slug)
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
          reindexTagSlugs.push(slug)
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

    await this.search.reindexPosts({
      postSlugs: reindexPostSlugs,
      tagSlugs: reindexTagSlugs,
    })
  }
}
