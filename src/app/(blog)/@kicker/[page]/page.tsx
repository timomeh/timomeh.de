import { getCachedPageKicker } from '../data'
import { DataKicker } from '../data-kicker'

type Props = {
  params: Promise<{ page: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return getCachedPageKicker(params.page)
      }}
    />
  )
}
