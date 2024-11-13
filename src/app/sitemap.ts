import { MetadataRoute } from 'next'

import { getPost, listPosts, listTags, Post } from '@/lib/blog'

export default async function sitemap() {
  const [tags, posts, page] = await Promise.all([
    generateTagsSitemap(),
    generatePostsSitemap(),
    generatePageSitemap(),
  ])

  return [
    {
      url: 'https://timomeh.de/',
      changeFrequency: 'daily',
      priority: 1,
      lastModified: new Date(),
    },
    ...tags,
    ...posts,
    ...page,
  ] satisfies MetadataRoute.Sitemap
}

async function generateTagsSitemap() {
  const tags = await listTags()

  const sitemap = tags.map((tag) => ({
    url: `https://timomeh.de/tag/${tag}`,
    changeFrequency: 'daily',
    priority: 0.8,
    lastModified: new Date(),
  })) satisfies MetadataRoute.Sitemap

  return sitemap
}

async function generatePostsSitemap() {
  const slugs = await listPosts()
  const tryPosts = await Promise.all(slugs.map((slug) => getPost(slug)))
  const posts = tryPosts.filter((post): post is Post => !!post)

  const sitemap = posts.map((post) => ({
    url: `https://timomeh.de/posts/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified: new Date(post.updatedAt),
  })) satisfies MetadataRoute.Sitemap

  return sitemap
}

function generatePageSitemap() {
  const slugs = ['about', 'datenschutz', 'feeds', 'impressum']

  const sitemap = slugs.map((slug) => ({
    url: `https://timomeh.de/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified: new Date(),
  })) satisfies MetadataRoute.Sitemap

  return sitemap
}
