import { Suspense } from 'react'

import { PostPreview } from '@/app/(blog)/post-preview'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { PageNavBack } from '@/comps/layout/page-nav-back'
import { Prose } from '@/comps/prose'
import { pluralizePosts } from '@/lib/plurals'

import { ListPostsByYear, YearListedPost } from './data'

type Props = {
  params: Promise<{ year: string }>
}

const BLOCKING_RENDERED_AMOUNT = 5

export default async function Page(props: Props) {
  const { year } = await props.params
  const { posts } = await ListPostsByYear.invoke(year)
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
              {pluralizePosts(posts.length)} in {year}
            </h1>
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

async function RestOfPosts({ posts }: { posts: YearListedPost[] }) {
  return <>{posts.map(renderItem)}</>
}

function renderItem(post: YearListedPost) {
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
