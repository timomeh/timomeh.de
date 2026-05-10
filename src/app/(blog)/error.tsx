'use client'

import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function ErrorFragment({ reset }: Props) {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 md:p-8 md:py-12">
      <ErrorContent reset={reset} />
    </div>
  )
}
