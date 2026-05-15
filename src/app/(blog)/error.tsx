'use client'

import { ErrorContent } from '@/comps/error-content'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function ErrorFragment({ reset }: Props) {
  return (
    <>
      <PageNav>wow error</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <ErrorContent reset={reset} />
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}
