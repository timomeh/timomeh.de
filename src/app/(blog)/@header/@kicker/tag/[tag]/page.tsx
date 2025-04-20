import { getTag } from '@/data/tags'

import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ tag: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        const tag = await getTag(params.tag)
        return tag?.frontmatter.kicker
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
