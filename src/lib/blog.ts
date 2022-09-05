import { graphql } from '@octokit/graphql'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkUnwrapImages from 'remark-unwrap-images'
import rehypePrism from 'rehype-prism-plus'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

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
}

export const categoryId = 'DIC_kwDOH6oEFs4CROow'
const owner = 'timomeh'
const repo = 'timomeh.de'

type ListDiscussion = {
  repository: {
    discussions: {
      pageInfo: {
        endCursor: string
        hasNextPage: boolean
      }
      edges: {
        node: {
          title: string
          createdAt: string
          body: string
        }
      }[]
    }
  }
}

export async function getBlogPosts() {
  let hasNextPage = true
  let after: string | null = null
  let posts: ShortPost[] = []

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
            edges {
              node {
                title
                createdAt
                body
              }
            }
          }
        }
      }
    `,
      { owner, repo, categoryId, after }
    )

    const { pageInfo, edges } = result.repository.discussions

    const postsInPage = await Promise.all(
      edges.map(async (edge) => {
        const defaultPostedAt = edge.node.createdAt.split('T')[0]
        const { slug, postedAt = defaultPostedAt } = parseDiscussionTitle(
          edge.node.title
        )
        const title = (await extractPostTitle(edge.node.body)) || slug

        return {
          slug,
          postedAt: formatPostedAt(postedAt),
          title,
        }
      })
    )

    posts.push(...postsInPage)
    hasNextPage = pageInfo.hasNextPage
    after = pageInfo.endCursor
  } while (hasNextPage)

  const sortedPosts = posts.sort((postA, postB) => {
    return (
      new Date(postB.postedAt).getTime() - new Date(postA.postedAt).getTime()
    )
  })

  return sortedPosts
}

type SearchDiscussion = {
  search: {
    edges: {
      node: {
        title: string
        createdAt: string
        body: string
        category: {
          id: string
        }
      }
    }[]
  }
}

export async function getBlogPost(slug: string) {
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

  return {
    slug,
    postedAt: formatPostedAt(postedAt),
    title,
    rawTitle: extractRawPostTitle(discussion.body) || slug,
    body: await postBodyToHtml(discussion.body),
  }
}

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
    .use(rehypeGfm)
    .use(rehypeSlug)
    .use(rehypePrism)
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
