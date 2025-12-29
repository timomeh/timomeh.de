import { GetTagKicker } from '@/data/actions/getTagKicker'
import { DataKicker } from '../../../data-kicker'

type Props = {
  params: Promise<{ tag: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return GetTagKicker.invoke(params.tag)
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
