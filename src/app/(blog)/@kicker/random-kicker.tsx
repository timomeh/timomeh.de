import { Suspense } from 'react'

import { getCachedDefaultKicker } from './data'

export function RandomKicker() {
  return (
    <Suspense
      fallback={
        <span aria-hidden data-loaded="false">
          a loading state by and with
        </span>
      }
    >
      <RandomKickerSentence />
    </Suspense>
  )
}

async function RandomKickerSentence() {
  const kicker = await getCachedDefaultKicker()

  return <span data-loaded="true">{kicker}</span>
}
