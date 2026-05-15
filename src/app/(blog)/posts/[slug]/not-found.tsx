import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { ReadMore } from '@/comps/mdx/read-more'
import { Prose } from '@/comps/prose'

export default function NotFound() {
  return (
    <>
      <PageNav>post not found</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose>
            <h1>Page not found</h1>
            <p>Sorry, this Post does not seem to exist (anymore).</p>
            <ReadMore href="/posts">View all Posts</ReadMore>
          </Prose>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}
