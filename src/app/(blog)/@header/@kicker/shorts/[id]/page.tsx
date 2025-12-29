import { GetShortKicker } from '@/data/actions/getShortKicker'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ id: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return GetShortKicker.invoke(params.id)
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
