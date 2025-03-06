import Link from 'next/link'

type Props = {
  href: string
}

export function ReadMore({ href }: Props) {
  return (
    <Link
      className="dark:font-pixel whitespace-nowrap no-underline dark:pl-1 dark:text-sm"
      href={href}
    >
      <span className="dark:effect-crt-blue text-[#a18570]">
        Read moreeee
        <span className="hidden dark:inline" aria-hidden>
          {' '}
          →
        </span>
        <span className="inline dark:hidden" aria-hidden>
          …
        </span>
      </span>
    </Link>
  )
}
