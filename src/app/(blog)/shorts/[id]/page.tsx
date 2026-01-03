import Link from 'next/link'
import { Card } from '@/comps/card'
import { DetailedShort } from '@/comps/detailed-short'
import { ShortMetadata, ShowShort } from '../data'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const short = await ShowShort.invoke(params.id)

  return (
    <article lang={short.metaLang?.split('_')[0]} className="relative mt-2">
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <div className="px-2 py-4 xs:px-4 sm:p-6 md:p-8" key={short.id}>
            <DetailedShort short={short} />
          </div>
          <footer className="px-4 sm:px-6 md:px-8 py-3 flex justify-center items-center">
            <Link
              href="/shorts"
              className="font-normal text-sm whitespace-nowrap no-underline dark:text-blue-300"
            >
              Back to all Shorts
            </Link>
          </footer>
        </div>
      </Card>
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
