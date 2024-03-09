import { listPosts } from '@/lib/blog'

export async function getRelatedPosts(slug: string) {
  const posts = await listPosts()
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) {
    return { prev: null, next: null }
  }

  const next = posts[index - 1]?.slug || null
  const prev = posts[index + 1]?.slug || null
  return { prev, next }
}
