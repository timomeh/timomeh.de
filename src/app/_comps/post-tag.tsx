import { ComponentProps } from 'react'

import { Tag } from './tag'
import { getCategoryBySlug } from '../_data/category.dto'

type Props = {
  slug: string
} & Partial<ComponentProps<typeof Tag>>

export async function PostTag({ slug, ...rest }: Props) {
  const category = await getCategoryBySlug(slug)
  if (!category) return null

  return <Tag {...rest} color={category.color} name={category.name} />
}
