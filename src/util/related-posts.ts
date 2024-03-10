import { listPosts } from '@/lib/blog'

export async function getRelatedPosts(slug: string) {
  const posts = await listPosts()
  const index = posts.findIndex((post) => post === slug)

  if (index === -1) {
    return { prev: null, next: null }
  }

  const next = posts[index - 1] || null
  const prev = posts[index + 1] || null
  return { prev, next }
}
