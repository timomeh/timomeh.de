import { getCachedPostKicker } from '../../data'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ slug: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return getCachedPostKicker(params.slug)
      }}
    />
  )
}
