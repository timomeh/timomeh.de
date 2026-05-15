import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'
import { ShortsService } from '@/data/shorts/shorts.service'

export type ListedShort = Awaited<
  ReturnType<ShortsService['listEnriched']>
>[0] & {
  type: 'short'
}
export type ListedPost = Awaited<ReturnType<PostsRepo['listPublished']>>[0] & {
  type: 'post'
}

type ShortGroup = {
  type: 'shorts'
  items: ListedShort[]
}

export type Readable = ListedPost | ShortGroup

export class ListReadables extends Vla.Action {
  postsRepo = this.inject(PostsRepo)
  shortsService = this.inject(ShortsService)

  async handle() {
    const posts = await this.postsRepo.listPublished()
    const shorts = await this.shortsService.listEnriched()

    const combined = [
      ...posts.map((p) => ({ type: 'post' as const, ...p })),
      ...shorts.map((s) => ({ type: 'short' as const, ...s })),
    ].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

    const redables: Readable[] = []
    let currentShortsGroup: ShortGroup | null = null

    for (const item of combined) {
      if (item.type === 'post') {
        currentShortsGroup = null
        redables.push(item)
      } else if (item) {
        if (!currentShortsGroup) {
          currentShortsGroup = { type: 'shorts', items: [] }
          redables.push(currentShortsGroup)
        }
        currentShortsGroup.items.push(item)
      }
    }

    return redables
  }
}
