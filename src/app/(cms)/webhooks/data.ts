import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { Vla } from 'vla'
import { PagesCache } from '@/data/pages/pagesCache.service'
import { PostsRepo } from '@/data/posts/posts.repo'
import { PostsCache } from '@/data/posts/postsCache.service'
import { PostTagsCache } from '@/data/postTags/postTagsCache.service'
import { SettingsCache } from '@/data/settings/settingsCache.service'
import { ShortsCache } from '@/data/shorts/shortsCache.service'
import { TagsCache } from '@/data/tags/tagsCache.service'
import { log as baseLog } from '@/lib/log'

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

export class UpdateChangedFiles extends Vla.Action {
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
