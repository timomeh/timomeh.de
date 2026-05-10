import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(_props: Props) {
  return (
    <div className="flex py-1 flex-nowrap space-x-4">
      <Link
        href="/shorts"
        className="
          hover:underline hover:opacity-100
          opacity-70 transition-all back-link
        "
      >
        <ArrowLeft className="inline-block size-3 mr-1 -mt-0.5" />
        <span>Back to all Shorts</span>
      </Link>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
