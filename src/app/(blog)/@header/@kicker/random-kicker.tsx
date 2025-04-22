import { Suspense } from 'react'

import { getDefaultKickers } from '@/data/settings'
import { sample } from '@/lib/sample'

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
  const kickers = await getDefaultKickers()
  const fallback = 'a head full of milk foam by'

  const kicker = kickers.length > 0 ? sample(kickers) : fallback

  return <span data-loaded="true">{kicker}</span>
}
