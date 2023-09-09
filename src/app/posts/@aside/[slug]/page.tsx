import { notFound } from 'next/navigation'

import { getPost } from '@/lib/blog'
import { getChapters } from '@/lib/mdx'
import { slugify } from '@/lib/slugify'
import { MDXRenderer } from '@/components/MDXRenderer'
import { Toc, TocEntry } from '@/components/Toc'

export const generateStaticParams = () => []

type Props = {
  params: {
    slug: string
  }
}

export default async function Post({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()
  if (!post.meta.toc) return null

  const chapters = getChapters(post.body)

  return (
    <Toc>
      <TocEntry name="top">
        <MDXRenderer content={post.title} inline />
      </TocEntry>
      {chapters.map((chapter) => {
        const slug = slugify(chapter)

        return (
          <TocEntry name={slug} key={slug}>
            <MDXRenderer content={chapter} inline />
          </TocEntry>
        )
      })}
    </Toc>
  )
}
