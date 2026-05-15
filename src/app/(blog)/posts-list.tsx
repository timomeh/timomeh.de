import { PostPreview } from '@/app/(blog)/post-preview'
import { ShortsGroup } from '@/app/(blog)/shorts-group'

import { ListReadables } from './data'

export async function PostsList() {
  const readables = await ListReadables.invoke()

  return (
    <ul>
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
