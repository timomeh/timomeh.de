import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-30 mx-auto flex w-full max-w-2xl justify-end px-4 py-10">
      <div className="text-2xs font-semibold text-gray-900 uppercase dark:text-white">
        <ul
          className="space-x-1 text-right *:inline-block *:before:mr-1 *:before:inline-block
            *:before:opacity-40 *:before:content-['·'] *:first:before:hidden"
        >
          <li>
            <Link
              href="/about"
              className="opacity-40 transition-opacity hover:opacity-60"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/feeds"
              className="opacity-40 transition-opacity hover:opacity-60"
            >
              Feeds
            </Link>
          </li>
          <li>
            <Link
              href="/impressum"
              className="opacity-40 transition-opacity hover:opacity-60"
            >
              Imprint
            </Link>
          </li>
          <li>
            <Link
              href="/datenschutz"
              className="opacity-40 transition-opacity hover:opacity-60"
            >
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
