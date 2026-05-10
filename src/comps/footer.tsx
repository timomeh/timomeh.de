import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-30 font-mono">
      <div className="mx-auto max-w-2xl p-4 sm:p-6 md:p-8 md:py-12">
        <div
          className="
            text-2xs font-semibold text-gray-900 uppercase
            dark:text-white
          "
        >
          <ul
            className="
              space-x-1
              *:inline-block
              *:before:mr-1 *:before:inline-block *:before:opacity-40
              *:before:content-['·']
              *:first:before:hidden
            "
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
                href="/tags"
                className="opacity-40 transition-opacity hover:opacity-60"
              >
                Tags
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
      </div>
    </footer>
  )
}
