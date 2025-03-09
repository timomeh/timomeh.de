'use client'

import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function Error({ reset }: Props) {
  return (
    <ErrorContent
      reset={reset}
      description={
        <p>
          Whoopsie daisy, something went terribly wrong while rendering this
          post. Not all hope is lost, you can try the following steps:
        </p>
      }
    />
  )
}
