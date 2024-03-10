import { Octokit } from '@octokit/core'
import { Discussion, Label } from '@octokit/graphql-schema'
import { paginateGraphql } from '@octokit/plugin-paginate-graphql'
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

function gh() {
  const CustomOctokit = Octokit.plugin(paginateGraphql)

  const gh = new CustomOctokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
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

  return gh
}

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

  const { search } = await gh().graphql.paginate<{
    search: { nodes: Discussion[] }
  }>(
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
    },
  )

  return search.nodes
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

    const { search } = await gh().graphql<{
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
                  color
                  description
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
    revalidateTags: (slug) => ['github', `github/discussion/${slug}`],
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
    const res = await gh()
      .request('GET /repos/{owner}/{repo}/labels/{name}', { owner, repo, name })
      .catch((error) => {
        console.error(error)
        return null
      })

    const label = res?.data || null
    return label
  },
  {
    additionalCacheKey: ['fetchLabel'],
    revalidateTags: (name) => ['github', `github/label/${name}`],
    // @ts-expect-error
    duration: false,
  },
)
