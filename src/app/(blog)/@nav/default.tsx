import Link from 'next/link'

export default function Default() {
  return (
    <div className="flex flex-nowrap space-x-4 py-1">
      <Link
        href="/"
        className="opacity-70 transition-all hover:underline hover:opacity-100"
      >
        Posts
      </Link>
      <Link
        href="/shorts"
        className="opacity-70 transition-all hover:underline hover:opacity-100"
      >
        Shorts
      </Link>
    </div>
  )
}
