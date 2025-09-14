import { cache } from 'react'
import { listPostYears, listPublishedPostsByYear } from './posts'
import { listShortsByYear, listShortYears } from './shorts'

type Filter = {
  sort?: 'asc' | 'desc'
  limit?: number
}

export const listEntriesByYear = cache(
  async (year: number, filter: Filter = {}) => {
    // maybe this could be a UNION ALL query instead,
    // but i'm too lazy for that
    const [posts, shorts] = await Promise.all([
      listPublishedPostsByYear(year, filter),
      listShortsByYear(year, filter),
    ])

    // combine and sort all entires into a single timeline
    const sorted = [...posts, ...shorts].sort((a, b) => {
      if (filter.sort === 'asc') {
        return a.publishedAt.getTime() - b.publishedAt.getTime()
      }

      return b.publishedAt.getTime() - a.publishedAt.getTime()
    })

    return sorted
  },
)

export const listEntryYears = cache(async () => {
  const [postYears, shortYears] = await Promise.all([
    listPostYears(),
    listShortYears(),
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
