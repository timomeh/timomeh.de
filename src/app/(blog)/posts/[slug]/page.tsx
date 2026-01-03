import Link from 'next/link'

import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { Tag } from '@/comps/tag'
import { formatReadingTime } from '@/lib/formatReadingTime'
import { PostMetadata, ShowPost } from './data'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { post, assetPrefix } = await ShowPost.invoke(params.slug)

  return (
    <article
      lang={post.metaLang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <Prose>
        <PostHeader
          publishedAt={post.publishedAt}
          readingTime={formatReadingTime(
            post.content,
            post.readingTime,
            'read',
          )}
        />
        <div className="not-prose -m-0.5 mb-2 hidden sm:block lg:hidden">
          {post.postTags.map(({ tag }) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="group/btn inline-flex p-0.5"
            >
              <Tag title={tag.title} />
            </Link>
          ))}
        </div>
        <MDX
          cacheKey={`post-${post.slug}`}
          cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
          content={post.content}
          assetPrefix={assetPrefix}
        />
      </Prose>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return PostMetadata.invoke(params.slug)
}
