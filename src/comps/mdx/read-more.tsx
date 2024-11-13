import Link from 'next/link'

type Props = {
  href: string
}

export function ReadMore({ href }: Props) {
  return (
    <Link
      className="effect-crt-blue whitespace-nowrap pl-1 font-pixel text-sm no-underline"
      href={href}
    >
      Read more →
    </Link>
  )
}
