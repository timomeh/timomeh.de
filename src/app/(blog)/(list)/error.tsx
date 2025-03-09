'use client'

import { ErrorContent } from '@/comps/error-content'

type Props = {
  reset: () => void
  error: Error & { digest?: string }
}

export default function Error({ reset }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <ErrorContent
        reset={reset}
        description={
          <p>
            Whoopsie daisy, something went terribly wrong while trying to list
            these post. Not all hope is lost, you can try the following steps:
          </p>
        }
      />
    </div>
  )
}
