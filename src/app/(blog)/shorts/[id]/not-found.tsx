import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { ReadMore } from '@/comps/mdx/read-more'
import { Prose } from '@/comps/prose'

export default function NotFound() {
  return (
    <>
      <PageNav>short not found</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose>
            <h1>Page not found</h1>
            <p>
              Sorry, this Short does not seem to exist (anymore). Maybe it was
              so cringe that I deleted it.
            </p>
            <ReadMore href="/shorts">View all Shorts</ReadMore>
          </Prose>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}
