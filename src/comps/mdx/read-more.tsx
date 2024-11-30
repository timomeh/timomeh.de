import Link from 'next/link'

type Props = {
  href: string
}

export function ReadMore({ href }: Props) {
  return (
    <Link
      className="whitespace-nowrap pl-1 font-pixel text-sm no-underline"
      href={href}
      data-umami-event="Read more"
    >
      <span className="effect-crt-blue">Read more →</span>
    </Link>
  )
}
