import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(_props: Props) {
  return (
    <div className="flex flex-nowrap space-x-4 py-1">
      <Link
        href="/shorts"
        className="
          back-link opacity-70 transition-all
          hover:underline hover:opacity-100
        "
      >
        <ArrowLeft className="-mt-0.5 mr-1 inline-block size-3" />
        <span>Back to all Shorts</span>
      </Link>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
