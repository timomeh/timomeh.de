import { getPageBySlug } from '@/data/pages'

import { DataKicker } from '../data-kicker'

type Props = {
  params: Promise<{ page: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        const page = await getPageBySlug(params.page)
        return page?.kicker
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
