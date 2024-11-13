'use client'

import { Footer } from '@/comps/footer'
import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
}

export default function Error({ reset }: Props) {
  return (
    <>
      <main className="relative z-30 w-full flex-1">
        <div className="mx-auto max-w-2xl px-4">
          <ErrorContent reset={reset} />
        </div>
      </main>
      <Footer />
    </>
  )
}
