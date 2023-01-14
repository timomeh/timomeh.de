import { graphql } from '@octokit/graphql'

const owner = 'timomeh'
const repo = 'timomeh.de'

const categoryIds = {
  posts: 'DIC_kwDOH6oEFs4CROow',
  offtopic: 'DIC_kwDOH6oEFs4CTj4l',
} as const

export type Discussion = {
  title: string
  createdAt: string
  updatedAt: string
  body: string
  bodyHTML: string
  number: number
  category: {
    id: string
  }
}

const api = graphql.defaults({
  headers: {
    authorization: 'token '.concat(process.env.GITHUB_ACCESS_TOKEN!),
  },
})

type ListDiscussionsResult = {
  repository: {
    discussions: {
      pageInfo: {
        endCursor: string
        hasNextPage: boolean
      }
      nodes: Discussion[]
    }
  }
}

type ListDiscussions = {
  category: keyof typeof categoryIds
}

export async function listDiscussions({ category }: ListDiscussions) {
  let hasNextPage = true
  let after: string | null = null
  let discussions: Discussion[] = []

  do {
    const result: ListDiscussionsResult = await api(
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
              number
              category {
                id
              }
            }
          }
        }
      }
    `,
      { owner, repo, categoryId: categoryIds[category], after }
    )

    const { pageInfo, nodes } = result.repository.discussions

    discussions.push(...nodes)
    hasNextPage = pageInfo.hasNextPage
    after = pageInfo.endCursor
  } while (hasNextPage)

  const sorted = discussions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return sorted
}

type SearchDiscussionResult = {
  search: {
    edges: {
      node: Discussion
    }[]
  }
}

type GetDiscussion = {
  slug: string
  category: keyof typeof categoryIds
}

export async function getDiscussion({ slug, category }: GetDiscussion) {
  const result: SearchDiscussionResult = await api(
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
              updatedAt
              body
              bodyHTML
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
    return (
      result.node.title === slug &&
      result.node.category.id === categoryIds[category]
    )
  })?.node

  return discussion
}
