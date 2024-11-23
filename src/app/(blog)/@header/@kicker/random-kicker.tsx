import { getSettings } from '@/data/settings'
import { sample } from '@/lib/sample'
import { Suspense } from 'react'

export function RandomKicker() {
  return (
    <Suspense>
      <RandomKickerSentence />
    </Suspense>
  )
}

async function RandomKickerSentence() {
  const { kickers } = await getSettings()
  const fallback = 'a head full of milk foam by'

  const kicker = kickers?.length > 0 ? sample(kickers) : fallback

  return <span>{kicker}</span>
}
