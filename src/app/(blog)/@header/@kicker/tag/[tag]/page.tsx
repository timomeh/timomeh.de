'use cache'

import { getTag } from '@/data/tags'
import { RandomKicker } from '../../random-kicker'

type Props = {
  params: Promise<{ tag: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const tag = await getTag(params.tag)

  if (tag?.frontmatter.kicker) {
    return <span>{tag.frontmatter.kicker}</span>
  }

  return <RandomKicker />
}
