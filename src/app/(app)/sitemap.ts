import { MetadataRoute } from 'next'
import { listCategories } from '@/app/_data/category.dto'
import { PostDto, getPostBySlug, listPosts } from '@/app/_data/post.dto'
import { PageDto, getPageBySlug, listPages } from '@/app/_data/page.dto'

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
  const categories = await listCategories()

  const sitemap = categories.map((slug) => ({
    url: `https://timomeh.de/tag/${slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
    lastModified: new Date(),
  })) satisfies MetadataRoute.Sitemap

  return sitemap
}

async function generatePostsSitemap() {
  const slugs = await listPosts(undefined)
  const tryPosts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  const posts = tryPosts.filter((post): post is PostDto => !!post)

  const sitemap = posts.map((post) => ({
    url: `https://timomeh.de/posts/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified: new Date(post.updatedAt),
  })) satisfies MetadataRoute.Sitemap

  return sitemap
}

async function generatePageSitemap() {
  const slugs = await listPages()
  const tryPages = await Promise.all(slugs.map((slug) => getPageBySlug(slug)))
  const pages = tryPages.filter((page): page is PageDto => !!page)

  const sitemap = pages.map((page) => ({
    url: `https://timomeh.de/${page.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified: new Date(page.updatedAt),
  })) satisfies MetadataRoute.Sitemap

  return sitemap
}
