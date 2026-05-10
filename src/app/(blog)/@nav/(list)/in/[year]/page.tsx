import Link from 'next/link'

import { PostYearNav } from '../../../post-year-nav'

type Props = {
  params: Promise<{ year: string }>
}

export default async function Page({ params }: Props) {
  const { year } = await params

  return (
    <div className="flex py-1 flex-nowrap space-x-4">
      <Link href="/" className="font-medium hover:underline">
        Posts
      </Link>
      <PostYearNav year={year} />
      <Link href="/shorts" className="font-medium hover:underline">
        Shorts
      </Link>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
