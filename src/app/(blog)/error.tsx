'use client'

import { ErrorContent } from '@/comps/error-content'
import { Footer } from '@/comps/footer'
import { useCaptureException } from '@/lib/sentry-browser'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function Error({ reset, error }: Props) {
  useCaptureException(error)

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
