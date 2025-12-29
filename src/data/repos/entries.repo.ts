import { Vla } from 'vla'
import { PostsRepo } from '../repos/posts.repo'
import { ShortsRepo } from '../repos/shorts.repo'

type Filter = {
  sort?: 'asc' | 'desc'
  limit?: number
}

export class EntriesService extends Vla.Repo {
  postsRepo = this.inject(PostsRepo)
  shortsRepo = this.inject(ShortsRepo)

  byYears = this.memo(async (year: number, filter: Filter = {}) => {
    // maybe this could be a UNION ALL query instead,
    // but i'm too lazy for that
    const [posts, shorts] = await Promise.all([
      this.postsRepo.listPublishedByYear(year, filter),
      this.shortsRepo.listByYear(year, filter),
    ])

    // combine and sort all entires into a single timeline
    const sorted = [...posts, ...shorts].sort((a, b) => {
      if (filter.sort === 'asc') {
        return a.publishedAt.getTime() - b.publishedAt.getTime()
      }

      return b.publishedAt.getTime() - a.publishedAt.getTime()
    })

    return sorted
  })

  listYears = this.memo(async () => {
    const [postYears, shortYears] = await Promise.all([
      this.postsRepo.listYears(),
      this.shortsRepo.listYears(),
    ])

    const map = new Map()

    for (const { year, count } of postYears) {
      if (!map.has(year))
        map.set(year, { year, postsCount: 0, shortsCount: 0, count: 0 })
      const obj = map.get(year)
      obj.postsCount = count
      obj.count += count
    }

    for (const { year, count } of shortYears) {
      if (!map.has(year))
        map.set(year, { year, postsCount: 0, shortsCount: 0, count: 0 })
      const obj = map.get(year)
      obj.shortsCount = count
      obj.count += count
    }

    const entryYears = Array.from(map.values()).sort((a, b) => b.year - a.year)

    return entryYears
  })
}
