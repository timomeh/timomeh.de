import { withCustomRequest } from '@octokit/graphql'
import { request } from '@octokit/request'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeExternalImgSize from 'rehype-external-img-size'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { cache } from 'react'

const myRequest = request.defaults({
  headers: {
    authorization: 'token '.concat(process.env.GITHUB_ACCESS_TOKEN!),
  },
})

const api = withCustomRequest(myRequest)

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
      const title = (await extractPostTitle(discussion.body)) || slug

      return {
        slug,
        postedAt: formatPostedAt(postedAt),
        title,
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
      const defaultPostedAt = discussion.createdAt.split('T')[0]
      const { slug, postedAt = defaultPostedAt } = parseDiscussionTitle(
        discussion.title
      )

      return {
        slug,
        postedAt: new Date(formatPostedAt(postedAt)),
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
  const title = (await extractPostTitle(discussion.body)) || slug
  const body = await postBodyToHtml(discussion.body)

  return {
    slug,
    postedAt: formatPostedAt(postedAt),
    title,
    discussionNumber: discussion.number,
    rawTitle: extractRawPostTitle(discussion.body) || slug,
    body,
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

async function extractPostTitle(body: string) {
  // Get first heading (h1), turn into HTML, return as string without h1 tag
  const titleExp = /^# (.*$)/gim
  const h1Exp = /(<h1>|<\/h1>)/gim

  const matches = titleExp.exec(body)

  const title = matches?.[0]
  if (!title) {
    return undefined
  }

  const vfile = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(title)

  return vfile.value.toString().replace(h1Exp, '')
}

async function postBodyToHtml(body: string) {
  const titleExp = /^# (.*$)/gim
  const bodyWithoutTitle = body.replace(titleExp, '').trim()

  const vfile = await unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkUnwrapImages)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalImgSize)
    .use(rehypePrismPlus)
    .use(rehypeGfm)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
    })
    .use(rehypeStringify)
    .process(bodyWithoutTitle)

  return vfile.value.toString()
}

function formatPostedAt(postedAt: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(new Date(postedAt))
}
