import { getCachedShortKicker } from '../../data'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ id: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return getCachedShortKicker(params.id)
      }}
    />
  )
}
