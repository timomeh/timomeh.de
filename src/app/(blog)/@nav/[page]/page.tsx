import Link from 'next/link'

type Props = {
  params: Promise<{ page: string }>
}

export default async function Page(_props: Props) {
  return (
    <div className="flex py-1 flex-nowrap space-x-4">
      <Link
        href="/"
        className="hover:underline opacity-70 hover:opacity-100 transition-all"
      >
        Posts
      </Link>
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
