import { DetailedShort } from '@/comps/detailed-short'

import { ShortMetadata, ShowShort } from '../data'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const short = await ShowShort.invoke(params.id)

  return (
    <article lang={short.metaLang?.split('_')[0]} className="relative">
      <div className="p-4 sm:p-6 md:p-8 md:py-12 max-w-2xl mx-auto">
        <DetailedShort short={short} />
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return ShortMetadata.invoke(params.id)
}
