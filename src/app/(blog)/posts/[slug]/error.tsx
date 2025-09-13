'use client'

import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function ErrorFragment({ reset }: Props) {
  return (
    <ErrorContent
      reset={reset}
      description={
        <p>Sorry, something went wrong while trying to load this post.</p>
      }
    />
  )
}
