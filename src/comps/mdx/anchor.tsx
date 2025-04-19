import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export function Anchor(props: Props) {
  const isLocalLink =
    props.href?.startsWith('https://timomeh.de') ||
    props.href?.startsWith('/') ||
    props.href?.startsWith('#')
  const isFeedLink = /\.(json|atom|rss)$/.test(props.href || '')

  if (isLocalLink && !isFeedLink) {
    const { href, ref: _, children, ...rest } = props
    return (
      <Link {...rest} href={href!.replace('https://timomeh.de', '')}>
        {children}
      </Link>
    )
  }

  // external links. shows an external link indicator, but only for h1's

  return (
    <a {...props} rel="noopener noreferrer" target="_blank">
      {props.children}
      <span
        aria-label="External link"
        className="external-link font-pixel ml-2 hidden text-[0.7em] leading-none font-normal
          opacity-50 sm:ml-3"
      >
        <ExternalLinkIcon className="size-4 sm:size-6" />
      </span>
    </a>
  )
}
