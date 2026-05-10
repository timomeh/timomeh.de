import Link from 'next/link'

import { PostYearNav } from '../post-year-nav'

export default async function Page() {
  return (
    <div className="flex py-1 flex-nowrap space-x-4">
      <Link href="/" className="font-bold hover:underline">
        Posts
      </Link>
      <PostYearNav year={null} />
      <Link
        href="/shorts"
        className="hover:underline opacity-70 hover:opacity-100 transition-all"
      >
        Shorts
      </Link>
    </div>
  )
}
