import { graphql } from '@octokit/graphql'
import { Discussion, Label, PageInfo } from '@octokit/graphql-schema'
import { sortBy } from 'lodash'
import { memoize } from 'nextjs-better-unstable-cache'

const owner = 'timomeh'
const repo = 'timomeh.de'

export function isAllowedCategory(slug: string) {
  return slug === 'offtopic' || slug === 'posts'
}

export function isTag(slug?: string | null) {
  return !!slug?.startsWith('tag:')
}

const gh = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_ACCESS_TOKEN!}`,
  },
  request: {
    fetch(url: string, options: RequestInit) {
      return fetch(url, {
        ...options,
        // we're wrapping the requests and caching them separately
        cache: 'no-store',
      })
    },
  },
})

type ListFilter = {
  label?: string
}

async function fetchDiscussions(filter: ListFilter = {}) {
  const queries = [
    `repo:${owner}/${repo}`,
    'category:posts',
    'category:offtopic',
  ]
  if (filter.label) queries.push(`label:tag:${filter.label}`)

  let hasNextPage = true
  let cursor: string | null = null
  let discussions: Discussion[] = []

  do {
    const res: {
      search: { nodes: Discussion[]; pageInfo: PageInfo }
    } = await gh(
      `query paginate($cursor: String) {
        search(type: DISCUSSION, query: "${queries.join(' ')}", first: 100, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...on Discussion {
              title
              createdAt
              labels(first: 100) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }`,
      {
        q: queries.join(' '),
        cursor,
      },
    )

    hasNextPage = res.search.pageInfo.hasNextPage
    cursor = res.search.pageInfo.endCursor || null
    discussions.push(...res.search.nodes)
  } while (hasNextPage)

  return discussions
}

export const fetchSortedDiscussions = memoize(
  async (filter: ListFilter = {}) => {
    let discussions = await fetchDiscussions(filter)
    discussions = discussions.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return discussions
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
    const queries = [
      `${slug} in:title`,
      `repo:${owner}/${repo}`,
      'category:posts',
      'category:offtopic',
    ]

    const { search } = await gh<{
      search: { nodes: Discussion[] }
    }>(
      `{
        search(type: DISCUSSION, query: "${queries.join(' ')}", first: 100) {
          nodes {
            ...on Discussion {
              title
              createdAt
              updatedAt
              body
              bodyHTML
              number
              labels(first: 100) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }`,
    )

    const result = search.nodes?.find((discussion) => discussion.title === slug)
    if (!result) return null

    return result
  },
  {
    additionalCacheKey: ['fetchDiscussion'],
    revalidateTags: (slug) => [
      'github',
      'github/discussion/*',
      `github/discussion/${slug}`,
    ],
    // @ts-expect-error
    duration: false,
  },
)

export const fetchSortedLabels = memoize(
  async () => {
    const discussions = await fetchDiscussions()
    const labelsWithDuplicates = discussions
      .flatMap((discussion) => discussion.labels?.nodes)
      .filter((label): label is Label => isTag(label?.name))
    const labelsWithCount = labelsWithDuplicates.reduce(
      (acc, label) => {
        if (acc[label.name]) acc[label.name].count++
        else acc[label.name] = { count: 1, label }
        return acc
      },
      {} as Record<string, { count: number; label: Label }>,
    )
    const sortedLabels = sortBy(labelsWithCount, 'count')
      .map(({ label }) => label)
      .reverse()
    return sortedLabels
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
    const res = await gh<{ repository: { label: Label | null } }>(
      `query label($owner: String!, $repo: String!, $name: String!) {
        repository(owner: $owner, name: $repo) {
          label(name: $name) {
            name
            description
            color
          }
        }
      }`,
      {
        owner,
        repo,
        name,
      },
    )

    return res.repository.label
  },
  {
    additionalCacheKey: ['fetchLabel'],
    revalidateTags: (name) => [
      'github',
      'github/label/*',
      `github/label/${name}`,
    ],
    // @ts-expect-error
    duration: false,
  },
)
