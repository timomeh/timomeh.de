import Link from 'next/link'

type Props = {
  href: string
  children?: React.ReactNode
}

export function ReadMore({ href, children = 'Read more' }: Props) {
  return (
    <Link
      className="
        font-normal whitespace-nowrap text-[#35945e] no-underline
        dark:text-blue-300
      "
      href={href}
    >
      {children}
    </Link>
  )
}
