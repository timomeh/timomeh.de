import { Suspense } from 'react'

import { getCachedDefaultKicker } from './data'

type Props = {
  fetcher: () => Promise<string | undefined | null>
}

export function DataKicker(props: Props) {
  return (
    <Suspense
      fallback={
        <span data-loaded="false" aria-hidden>
          a loading state by and with
        </span>
      }
    >
      <FetchedKickerSentence {...props} />
    </Suspense>
  )
}

async function FetchedKickerSentence(props: Props) {
  const kicker = await props.fetcher()

  if (kicker) return <span data-loaded="true">{kicker}</span>

  return <DefaultKicker />
}

async function DefaultKicker() {
  const kicker = await getCachedDefaultKicker()
  return <span data-loaded="true">{kicker}</span>
}
