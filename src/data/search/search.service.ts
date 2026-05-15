import { Vla } from 'vla'

import { PostsRepo } from '@/data/posts/posts.repo'
import { PostsSearchRepo } from '@/data/search/postsSearch.repo'
import { TagsRepo } from '@/data/tags/tags.repo'
import { log as baseLog } from '@/lib/log'
import { sleep } from '@/lib/sleep'

const log = baseLog.child().withContext({ module: 'search/service' })

export class Search extends Vla.Service {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)
  postsSearchRepo = this.inject(PostsSearchRepo)

  async reindex() {
    const freshPosts = await this.postsRepo.all.fresh()

    await this.postsSearchRepo.deleteAll()
    await sleep(1_000)
    log.info('✅ Cleared search index')

    await this.postsSearchRepo.insertMany(freshPosts)
  }

  async reindexPosts({
    postSlugs,
    tagSlugs,
  }: {
    postSlugs: string[]
    tagSlugs: string[]
  }) {
    if (postSlugs.length < 1 && tagSlugs.length < 1) {
      return
    }

    // get affected posts from affected tags
    const tags = await this.tagsRepo.findManyBySlugs(tagSlugs)
    const postsFromAffectedTags = await Promise.all(
      tags.map((tag) => this.postsRepo.byTag(tag.id)),
    )
    const postSlugsFromAffectedTags = postsFromAffectedTags
      .flat()
      .map((post) => post.slug)

    const allSlugs = [...new Set([...postSlugs, ...postSlugsFromAffectedTags])]
    const freshPosts = await this.postsRepo.bySlugs.fresh(allSlugs)

    const ids = freshPosts.map((post) => post.id)
    if (ids.length < 1) return

    await this.postsSearchRepo.deleteByIds(ids)
    await sleep(200) // give it a bit of a cooldown
    await this.postsSearchRepo.insertMany(freshPosts)
  }

  async fuzzyPosts(query: string) {
    const rows = await this.postsSearchRepo.list(query)
    const ids = rows.map((row) => row.id)
    const posts = await this.postsRepo.listPublishedByIds(ids)

    // restore order
    const order = new Map(rows.map((r, i) => [r.id, i]))
    const rankedResults = posts.sort(
      (a, b) => order.get(a.id)! - order.get(b.id)!,
    )

    return rankedResults
  }
}
