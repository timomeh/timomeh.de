import Link from 'next/link'

import { GetTagTitle } from '../../../data'

type Props = {
  params: Promise<{ tag: string }>
}

export default async function Page({ params }: Props) {
  const { tag } = await params
  const { title } = await GetTagTitle.invoke(tag)

  return (
    <div className="flex flex-nowrap space-x-4 py-1">
      <Link href="/" className="font-bold hover:underline">
        Posts
      </Link>
      <span className="line-clamp-1 max-w-[200px] overflow-hidden text-ellipsis">
        Tag: {title}
      </span>
      <Link
        href="/shorts"
        className="opacity-70 transition-all hover:underline hover:opacity-100"
      >
        Shorts
      </Link>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
