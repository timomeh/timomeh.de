'use client'

import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function ErrorFragment({ reset }: Props) {
  return (
    <div className="p-4 sm:p-6 md:p-8 md:py-12 max-w-2xl mx-auto">
      <ErrorContent reset={reset} />
    </div>
  )
}
