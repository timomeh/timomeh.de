'use client'

import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function Error({ reset }: Props) {
  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <ErrorContent
        reset={reset}
        description={
          <p>Sorry, something went wrong while trying to list these post.</p>
        }
      />
    </div>
  )
}
