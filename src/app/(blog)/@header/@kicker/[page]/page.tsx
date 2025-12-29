import { GetPageKicker } from '@/data/actions/getPageKicker'
import { DataKicker } from '../data-kicker'

type Props = {
  params: Promise<{ page: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return GetPageKicker.invoke(params.page)
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
