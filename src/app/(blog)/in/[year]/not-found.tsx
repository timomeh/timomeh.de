import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { ReadMore } from '@/comps/mdx/read-more'
import { Prose } from '@/comps/prose'

export default function NotFound() {
  return (
    <>
      <PageNav>year not found</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose>
            <h1>No posts in this year</h1>
            <p>Sorry, but there are no posts in this year.</p>
            <ReadMore href="/">View all Posts</ReadMore>
          </Prose>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}
