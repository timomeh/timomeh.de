import Link from 'next/link'

type Props = {
  href: string
}

export function ReadMore({ href }: Props) {
  return (
    <Link
      className="whitespace-nowrap no-underline dark:pl-1 dark:font-pixel dark:text-sm"
      href={href}
      data-umami-event="Read more"
    >
      <span className="dark:effect-crt-blue text-[#a18570]">
        Read more
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
