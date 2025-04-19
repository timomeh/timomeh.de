import Link from 'next/link'

type Props = {
  href: string
}

export function ReadMore({ href }: Props) {
  return (
    <Link
      className="font-normal whitespace-nowrap no-underline dark:text-blue-300"
      href={href}
    >
      Read more
    </Link>
  )
}
