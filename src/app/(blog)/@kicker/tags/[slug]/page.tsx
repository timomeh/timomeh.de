import { TagKicker } from '../../data'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ tag: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        return TagKicker.invoke(params.tag)
      }}
    />
  )
}

export async function generateStaticParams() {
  return []
}
