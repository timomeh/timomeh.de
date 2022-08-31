import { Octokit } from '@octokit/rest'
import matter from 'gray-matter'

type FrontMatter = {
  slug?: string
  date?: string
}

export type PostPreview = {
  title: string
  slug: string
  createdAt: string
  postedAt: string
}

export type FullPost = {
  title: string
  createdAt: string
  postedAt: string
  slug: string
  body: string
}

const gh = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
})

const owner = 'timomeh'
const repo = 'timomeh.de-new'

export async function getPostsList() {
  const issues = await gh.paginate('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    per_page: 100,
    // labels: 'published',
  })

  const posts = issues
    .filter((issue) => Boolean(issue.body))
    .map((issue) => {
      const { data } = parsePostBody(issue.body!)
      const createdAt =
        (data.date ? new Date(data.date).toISOString() : null) ||
        issue.created_at

      return {
        title: issue.title,
        slug: data.slug || '',
        createdAt,
        postedAt: createdAt.split('T')[0],
      }
    })
    // .filter((post): post is PostPreview => Boolean(post.slug)) // just to be sure
    .sort((a, b) => {
      const dateA = new Date(a.postedAt)
      const dateB = new Date(b.postedAt)
      return dateB.getTime() - dateA.getTime()
    })

  return posts
}

export async function getPost(slug: string) {
  const issues = await gh.paginate('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    per_page: 100,
    labels: 'published',
  })

  const issue = issues
    .filter((issue) => Boolean(issue.body))
    .find((issue) => {
      const { data } = parsePostBody(issue.body!)
      return data.slug === slug
    })

  if (!issue) {
    return undefined
  }

  const { data, content } = parsePostBody(issue.body!)
  const createdAt =
    (data.date ? new Date(data.date).toISOString() : null) || issue.created_at

  const post: FullPost = {
    title: issue.title,
    createdAt,
    postedAt: createdAt.split('T')[0],
    slug: data.slug!,
    body: content,
  }

  return post
}

function parsePostBody(body: string) {
  const result = matter(body, { delimiters: '+++' })

  return {
    content: result.content,
    data: result.data as FrontMatter,
  }
}
