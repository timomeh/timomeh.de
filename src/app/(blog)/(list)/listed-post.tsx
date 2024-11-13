import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { PostPreviewImage } from '@/comps/post-preview-image'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { parseMdTitle } from '@/lib/parseMdTitle'
import Link from 'next/link'

type Props = {
  slug: string
}

export async function ListedPost({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  const title = parseMdTitle(post.content)

  return (
    <article
      lang={post.meta.lang?.split('_')[0]}
      className="border-t border-white/10 pb-24"
    >
      <header>
        {post.frontmatter.cover ? (
          <div className="-mb-8 sm:-mb-16 md:-mb-20">
            <PostPreviewImage
              src={contentAsset('posts', slug, post.frontmatter.cover)}
              alt=""
            />
          </div>
        ) : (
          <div className="h-20" />
        )}
        <Link
          href={`/posts/${post.slug}`}
          className="relative mb-5 block w-auto no-underline"
        >
          <div
            className="prose prose-invert relative z-10 mx-auto max-w-2xl animate-fade-in px-4
              prose-headings:text-balance prose-headings:font-display
              prose-headings:font-semibold prose-headings:leading-tight prose-h1:text-2xl
              prose-h1:leading-tight sm:prose-h1:text-3xl"
          >
            <PostHeader slug={post.slug} />
            {title && (
              <MDX
                assetPrefix={contentAsset('posts', post.slug, '')}
                content={title}
              />
            )}
          </div>
        </Link>
      </header>
      <div className="mx-auto max-w-2xl px-4">
        <div
          className="prose prose-invert relative animate-fade-in prose-headings:text-balance
            prose-headings:font-display prose-headings:font-semibold
            prose-headings:leading-tight prose-h1:mb-0 prose-h1:text-2xl
            prose-h1:leading-tight md:prose-h1:text-3xl"
        >
          <MDX
            assetPrefix={contentAsset('posts', post.slug, '')}
            content={post.content.replace(/^# .+\n?/, '')}
            readMorePath={`/posts/${post.slug}`}
            scope={post.slug}
          />
        </div>
      </div>
    </article>
  )
}
