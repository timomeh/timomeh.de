import { Discussion } from '@octokit/graphql-schema'
import { memoize } from 'nextjs-better-unstable-cache'

export function isAllowedCategory(slug: string) {
  return slug === 'offtopic' || slug === 'posts'
}

export function isTag(slug?: string | null) {
  return !!slug?.startsWith('tag:')
}

type ListFilter = {
  label?: string
}

async function fetchDiscussions(filter: ListFilter = {}) {
  return []
}

export const fetchSortedDiscussions = memoize(
  async (filter: ListFilter = {}) => {
    return []
  },
  {
    additionalCacheKey: ['fetchSortedDiscussions'],
    revalidateTags: (filter = {}) => [
      'github',
      'github/discussions',
      filter.label
        ? `github/discussions/labeled:${filter.label}`
        : 'github/discussions/all',
    ],
    // @ts-expect-error
    duration: false,
  },
)

export const fetchDiscussion = memoize(
  async (slug: string) => {
    return null as Discussion | null
  },
  {
    additionalCacheKey: ['fetchDiscussion'],
    revalidateTags: (slug) => ['github', `github/discussion/${slug}`],
    // @ts-expect-error
    duration: false,
  },
)

export const fetchSortedLabels = memoize(
  async () => {
    return []
  },
  {
    additionalCacheKey: ['fetchSortedLabels'],
    revalidateTags: ['github', 'github/labels'],
    // @ts-expect-error
    duration: false,
  },
)

export const fetchLabel = memoize(
  async (name: string) => {
    return null
  },
  {
    additionalCacheKey: ['fetchLabel'],
    revalidateTags: (name) => ['github', `github/label/${name}`],
    // @ts-expect-error
    duration: false,
  },
)
