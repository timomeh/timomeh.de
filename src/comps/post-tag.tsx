import { ComponentProps } from 'react'

import { getTag } from '@/lib/blog'

import { Tag } from './tag'

type Props = {
  slug: string
} & Partial<ComponentProps<typeof Tag>>

export async function PostTag({ slug, ...rest }: Props) {
  const tag = await getTag(slug)
  if (!tag) return null

  return <Tag {...rest} color={tag.color} name={tag.name} />
}
