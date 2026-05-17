import { Suspense } from 'react'

import { PostPreview } from '@/app/(blog)/post-preview'
import { ShortsGroup } from '@/app/(blog)/shorts-group'
import { ScrollToHash } from '@/comps/scroll-to-hash'

import { ListReadables, Readable } from './data'

const BLOCKING_RENDERED_AMOUNT = 5

export async function PostsList() {
  const readables = await ListReadables.invoke()
  const initial = readables.slice(0, BLOCKING_RENDERED_AMOUNT)
  const rest = readables.slice(BLOCKING_RENDERED_AMOUNT)

  return (
    <ul>
      <ScrollToHash />
      {initial.map(renderItem)}
      <Suspense fallback={<LoadingFallback />}>
        <RestOfReadables readables={rest} />
      </Suspense>
    </ul>
  )
}

async function RestOfReadables({ readables }: { readables: Readable[] }) {
  return (
    <>
      <ScrollToHash />
      {readables.map(renderItem)}
    </>
  )
}

function renderItem(readable: Readable) {
  if (readable.type === 'post') {
    return (
      <li key={readable.id}>
        <PostPreview post={readable} />
      </li>
    )
  }
  if (readable.type === 'shorts') {
    return (
      <li key={readable.items[0].id}>
        <ShortsGroup shorts={readable.items} />
      </li>
    )
  }
  return null
}

function LoadingFallback() {
  return (
    <li id="loading-anchor">
      <div className="relative border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <p className="mb-[800px] animate-pulse text-center">
            Hang on, loading more…
          </p>
        </div>
      </div>
    </li>
  )
}
