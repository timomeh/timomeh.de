import Link from 'next/link'

import { GetTagTitle } from '../../../data'

type Props = {
  params: Promise<{ tag: string }>
}

export default async function Page({ params }: Props) {
  const { tag } = await params
  const { title } = await GetTagTitle.invoke(tag)

  return (
    <div className="flex py-1 flex-nowrap space-x-4">
      <Link href="/" className="hover:underline font-bold">
        Posts
      </Link>
      <span className="max-w-[200px] text-ellipsis overflow-hidden line-clamp-1">
        Tag: {title}
      </span>
      <Link
        href="/shorts"
        className="hover:underline opacity-70 hover:opacity-100 transition-all"
      >
        Shorts
      </Link>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
