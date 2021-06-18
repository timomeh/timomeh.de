import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

type FrontMatter = {
  title: string
}

export const POSTS_PATH = path.join(process.cwd(), 'posts')

export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  .filter((path) => /\.mdx?$/.test(path))

export function readPostSync(filePath: string) {
  const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
  const grayMatterFile = matter(source)
  const frontMatter = grayMatterFile.data as FrontMatter
  const excerpt = grayMatterFile.excerpt
  const content = grayMatterFile.content
  const slug = pathToSlug(filePath)

  return {
    content,
    frontMatter,
    excerpt,
    slug,
  }
}

export async function serializeMdx(content: string, frontMatter: FrontMatter) {
  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: frontMatter,
  })

  return mdxSource
}

export function pathToSlug(path: string) {
  return path.replace(/\.mdx?$/, '')
}

export function getSlugs() {
  return postFilePaths.map(pathToSlug)
}