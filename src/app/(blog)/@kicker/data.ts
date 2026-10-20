import { cacheLife, cacheTag } from 'next/cache'
import { Vla } from 'vla'

import { PagesRepo } from '@/data/pages/pages.repo'
import { PostsRepo } from '@/data/posts/posts.repo'
import { SettingsRepo } from '@/data/settings/settings.repo'
import { ShortsRepo } from '@/data/shorts/shorts.repo'
import { TagsRepo } from '@/data/tags/tags.repo'
import { env } from '@/env'
import { sample } from '@/lib/random'

export class PageKicker extends Vla.Action {
  pagesRepo = this.inject(PagesRepo)

  async handle(slug: string) {
    const page = await this.pagesRepo.bySlug(slug)
    return page?.kicker
  }
}

export async function getCachedPageKicker(slug: string) {
  'use cache'
  cacheLife('days')
  cacheTag('content:pages', `content:page:${slug}`)

  return PageKicker.invoke(slug)
}

export class PostKicker extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(slug: string) {
    const post = await this.postsRepo.bySlug(slug)
    return post?.kicker
  }
}

export async function getCachedPostKicker(slug: string) {
  'use cache'
  cacheLife('days')
  cacheTag('content:posts', `content:post:${slug}`)

  return PostKicker.invoke(slug)
}

export class ShortKicker extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(id: string) {
    const short = await this.shortsRepo.byId(id)
    return short?.kicker
  }
}

export async function getCachedShortKicker(id: string) {
  'use cache'
  cacheLife('days')
  cacheTag('content:shorts', `content:short:${id}`)

  return ShortKicker.invoke(id)
}

export class TagKicker extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)

  async handle(slug: string) {
    const tag = await this.tagsRepo.bySlug(slug)
    return tag?.kicker
  }
}

export async function getCachedTagKicker(slug: string) {
  'use cache'
  cacheLife('days')
  cacheTag('content:tags', `content:tag:${slug}`)

  return TagKicker.invoke(slug)
}

export class DefaultKicker extends Vla.Action {
  settingsRepo = this.inject(SettingsRepo)

  async handle() {
    const kickers = await this.settingsRepo.getDefaultKickers()
    const fallback = 'a head full of milk foam by'
    const kicker =
      kickers.length > 0 ? sample(kickers, env.RANDOM_SEED) : fallback

    return kicker
  }
}

export async function getCachedDefaultKicker() {
  'use cache'
  cacheLife('days')
  cacheTag('content:settings')

  return DefaultKicker.invoke()
}
