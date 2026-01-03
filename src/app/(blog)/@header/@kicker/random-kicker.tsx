import { Suspense } from 'react'
import { DefaultKicker } from './data'

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
  const kicker = await DefaultKicker.invoke()

  return <span data-loaded="true">{kicker}</span>
}
