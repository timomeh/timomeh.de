import { Suspense } from 'react'

import { PostPreview } from '@/app/(blog)/post-preview'
import { ShortsGroup } from '@/app/(blog)/shorts-group'

import { ListReadables, Readable } from './data'

const BLOCKING_RENDERED_AMOUNT = 5

export async function PostsList() {
  const readables = await ListReadables.invoke()
  const initial = readables.slice(0, BLOCKING_RENDERED_AMOUNT)
  const rest = readables.slice(BLOCKING_RENDERED_AMOUNT)

  return (
    <ul>
      {initial.map(renderItem)}
      <Suspense fallback={<li>Loading more...</li>}>
        <RestOfReadables readables={rest} />
      </Suspense>
      {readables.map((readable) => {
        if (readable.type === 'post') {
          const post = readable
          return (
            <li key={post.id}>
              <PostPreview post={post} />
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
      })}
    </ul>
  )
}

async function RestOfReadables({ readables }: { readables: Readable[] }) {
  return <>{readables.map(renderItem)}</>
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
