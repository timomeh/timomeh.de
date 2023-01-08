import { graphql } from '@octokit/graphql'
import { cache } from 'react'

const api = graphql.defaults({
  headers: {
    authorization: 'token '.concat(process.env.GITHUB_ACCESS_TOKEN!),
  },
})

export type ShortPost = {
  title: string
  slug: string
  postedAt: string
}

export type FullPost = {
  title: string
  rawTitle: string
  slug: string
  postedAt: string
  body: string
  discussionNumber: number
}

export type FeedPost = {
  title: string
  slug: string
  postedAt: Date
  updatedAt: Date
  body: string
}

export const categoryId = 'DIC_kwDOH6oEFs4CROow'
const owner = 'timomeh'
const repo = 'timomeh.de'

export const getBlogPosts = cache(async () => {
  const discussions = await fetchAllDiscussions()

  const posts = await Promise.all(
    discussions.map(async (discussion) => {
      const defaultPostedAt = discussion.createdAt.split('T')[0]
      const { slug, postedAt = defaultPostedAt } = parseDiscussionTitle(
        discussion.title
      )

      return {
        slug,
        postedAt: formatPostedAt(postedAt),
        rawTitle: extractRawPostTitle(discussion.body) || slug,
      }
    })
  )

  const sortedPosts = posts.sort((postA, postB) => {
    return (
      new Date(postB.postedAt).getTime() - new Date(postA.postedAt).getTime()
    )
  })

  return sortedPosts
})

export async function getFeedPosts() {
  const discussions = await fetchAllDiscussions()

  const posts = await Promise.all(
    discussions.map(async (discussion) => {
      const defaultPostedAt = discussion.createdAt
      const { slug, postedAt = defaultPostedAt } = parseDiscussionTitle(
        discussion.title
      )

      return {
        slug,
        postedAt: new Date(postedAt),
        updatedAt: new Date(discussion.updatedAt),
        title: extractRawPostTitle(discussion.body) || slug,
        body: discussion.bodyHTML,
      }
    })
  )

  const sortedPosts = posts.sort((postA, postB) => {
    return (
      new Date(postB.postedAt).getTime() - new Date(postA.postedAt).getTime()
    )
  })

  return sortedPosts
}

type ListDiscussion = {
  repository: {
    discussions: {
      pageInfo: {
        endCursor: string
        hasNextPage: boolean
      }
      nodes: {
        title: string
        createdAt: string
        updatedAt: string
        body: string
        bodyHTML: string
      }[]
    }
  }
}

async function fetchAllDiscussions() {
  let hasNextPage = true
  let after: string | null = null
  let discussions: ListDiscussion['repository']['discussions']['nodes'] = []

  do {
    const result: ListDiscussion = await api(
      `
      query list($owner: String!, $repo: String!, $categoryId: ID! $after: String) {
        repository(owner: $owner, name: $repo) {
          discussions(
            first: 100,
            after: $after,
            categoryId: $categoryId,
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              title
              createdAt
              updatedAt
              body
              bodyHTML
            }
          }
        }
      }
    `,
      { owner, repo, categoryId, after }
    )

    const { pageInfo, nodes } = result.repository.discussions

    discussions.push(...nodes)
    hasNextPage = pageInfo.hasNextPage
    after = pageInfo.endCursor
  } while (hasNextPage)

  return discussions
}

type SearchDiscussion = {
  search: {
    edges: {
      node: {
        title: string
        createdAt: string
        body: string
        number: number
        category: {
          id: string
        }
      }
    }[]
  }
}

export const getBlogPost = cache(async (slug: string) => {
  const result: SearchDiscussion = await api(
    `
    query postBySlug($search: String!) {
      search(
        query: $search
        type: DISCUSSION
        first: 100
      ) {
        edges {
          node {
            ... on Discussion {
              title
              createdAt
              body
              number
              category {
                id
              }
            }
          }
        }
      }
    }
  `,
    { search: `"${slug}" in:title repo:${owner}/${repo}` }
  )

  // In case we find discussions with similar titles, find the exact one
  const discussion = result.search.edges.find((result) => {
    const { slug: resultSlug } = parseDiscussionTitle(result.node.title)
    return resultSlug === slug && result.node.category.id === categoryId
  })?.node

  if (!discussion) {
    return undefined
  }

  const defaultPostedAt = discussion.createdAt.split('T')[0]
  const { postedAt = defaultPostedAt } = parseDiscussionTitle(discussion.title)

  return {
    slug,
    postedAt: formatPostedAt(postedAt),
    discussionNumber: discussion.number,
    rawTitle: extractRawPostTitle(discussion.body) || slug,
    rawBody: discussion.body,
  }
})

export function parseDiscussionTitle(title: string) {
  // Turn the discussion title into slug + optional postedAt date override
  const dateInTitleExp = /\(([^)]+)\)$/
  const dateMatches = dateInTitleExp.exec(title)

  return {
    slug: title.replace(dateInTitleExp, '').trim(),
    postedAt: dateMatches?.[1].trim(),
  }
}

function extractRawPostTitle(body: string) {
  const titleExp = /^# (.*$)/gim
  const matches = titleExp.exec(body)

  return matches?.[1].trim()
}

function formatPostedAt(postedAt: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(new Date(postedAt))
}
