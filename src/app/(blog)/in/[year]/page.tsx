import { PostPreview } from '@/app/(blog)/post-preview'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { Prose } from '@/comps/prose'
import { pluralizePosts } from '@/lib/plurals'

import { ListPostsByYear } from './data'

type Props = {
  params: Promise<{ year: string }>
}

export default async function Page(props: Props) {
  const { year } = await props.params
  const { posts } = await ListPostsByYear.invoke(year)

  return (
    <>
      <PageNav>on year</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !pt-12 sm:p-6 md:p-8">
          <Prose size="sm">
            <h1 className="!mb-1">
              {pluralizePosts(posts.length)} in {year}
            </h1>
          </Prose>
        </div>

        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <PostPreview post={post} />
            </li>
          ))}
        </ul>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateStaticParams() {
  return []
}
