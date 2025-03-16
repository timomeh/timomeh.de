import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-30 mx-auto flex w-full max-w-2xl justify-end px-4 py-10">
      <div
        className="font-display dark:font-pixel text-2xs font-bold text-orange-950 uppercase
          antialiased [font-feature-settings:'ss01'] dark:text-[9px] dark:text-white"
      >
        <ul
          className="flex space-x-1 *:after:ml-1 *:after:inline-block *:after:opacity-40
            *:after:content-['•'] *:last:after:hidden dark:*:after:content-['/']"
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
              href="/archive"
              className="opacity-40 transition-opacity hover:opacity-60"
            >
              Archive
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
