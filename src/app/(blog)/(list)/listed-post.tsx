import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { PostPreviewImage } from '@/comps/post-preview-image'
import { Prose } from '@/comps/prose'
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
          className="relative z-10 mx-auto mb-5 block w-auto max-w-2xl animate-fade-in px-4
            no-underline"
        >
          <Prose>
            <PostHeader slug={post.slug} />
            {title && (
              <MDX
                assetPrefix={contentAsset('posts', post.slug, '')}
                content={title}
              />
            )}
          </Prose>
        </Link>
      </header>
      <div className="relative mx-auto max-w-2xl animate-fade-in px-4">
        <Prose>
          <MDX
            assetPrefix={contentAsset('posts', post.slug, '')}
            content={post.content.replace(/^# .+\n?/, '')}
            readMorePath={`/posts/${post.slug}`}
            scope={post.slug}
          />
        </Prose>
      </div>
    </article>
  )
}
