import React from 'react'

import { Tag } from './tag'
import { getTag } from '@/data/tags'

type Props = {
  slug: string
} & Partial<React.ComponentProps<typeof Tag>>

export async function PostTag({ slug, ...rest }: Props) {
  const tag = await getTag(slug)
  if (!tag) return null

  return <Tag {...rest} color={tag.color || 'white'} title={tag.title} />
}
