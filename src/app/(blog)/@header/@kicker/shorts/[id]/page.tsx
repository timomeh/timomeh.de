import { getShortById } from '@/data/shorts'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ id: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        const short = await getShortById(params.id)
        return short?.kicker
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
