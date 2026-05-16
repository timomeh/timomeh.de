import { Suspense } from 'react'

import { PostPreview } from '@/app/(blog)/post-preview'
import {
  ListPostsByTag,
  TagListedPost,
  TagMetadata,
} from '@/app/(blog)/tags/data'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { PageNavBack } from '@/comps/layout/page-nav-back'
import { Prose } from '@/comps/prose'
import { pluralizePosts } from '@/lib/plurals'

type Props = {
  params: Promise<{ slug: string }>
}

const BLOCKING_RENDERED_AMOUNT = 5

export default async function Page(props: Props) {
  const { slug } = await props.params
  const { posts, tag } = await ListPostsByTag.invoke(slug)
  const initial = posts.slice(0, BLOCKING_RENDERED_AMOUNT)
  const rest = posts.slice(BLOCKING_RENDERED_AMOUNT)

  return (
    <>
      <PageNav>
        <PageNavBack href="/" />
      </PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !pt-12 sm:p-6 md:p-8">
          <Prose size="sm">
            <h1 className="!mb-1">
              {pluralizePosts(posts.length)} tagged {tag.title}
            </h1>
            <p className="!mt-1">
              {tag.description ||
                `More or less coherent thoughts about ${tag.title}.`}
            </p>
          </Prose>
        </div>

        <ul>
          {initial.map(renderItem)}
          <Suspense fallback={<LoadingFallback />}>
            <RestOfPosts posts={rest} />
          </Suspense>
        </ul>
      </PageMain>
      <PageFooter />
    </>
  )
}

async function RestOfPosts({ posts }: { posts: TagListedPost[] }) {
  return <>{posts.map(renderItem)}</>
}

function renderItem(post: TagListedPost) {
  return (
    <li key={post.id}>
      <PostPreview post={post} />
    </li>
  )
}

function LoadingFallback() {
  return (
    <li>
      <div className="relative border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <p className="mb-40 animate-pulse text-center">
            Hang on, loading more…
          </p>
        </div>
      </div>
    </li>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return TagMetadata.invoke(params.slug)
}
