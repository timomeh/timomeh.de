import { GetPostKicker } from '@/data/actions/getPostKicker'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ slug: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return GetPostKicker.invoke(params.slug)
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
