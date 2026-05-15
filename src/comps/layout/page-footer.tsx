import Link from 'next/link'

export function PageFooter() {
  return (
    <footer className="relative z-30 font-mono">
      <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
        <div
          className="
            font-mono text-xs text-current/60
          "
        >
          <Link href="/about" className="hover:underline">
            About
          </Link>
          {', '}
          <Link href="/archive" className="hover:underline">
            Archive
          </Link>
          {', '}
          <Link href="/feeds" className="hover:underline">
            Feeds
          </Link>
          {', '}
          <Link href="/impressum" className="hover:underline">
            Imprint
          </Link>
          {', '}
          <Link href="/datenschutz" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
