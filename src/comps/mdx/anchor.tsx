import Link from 'next/link'
import { ExternalLink } from '../icons/external-link'

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
    <a
      {...props}
      rel="noopener noreferrer"
      target="_blank"
      className={`group/link ${props.className || ''}`}
    >
      {props.children}
      <span
        aria-label="External link"
        className="relative top-1 ml-2 hidden h-6 w-6 font-pixel text-purple-300/60
          transition-colors group-hover/link:text-purple-300/100
          group-has-[h1>a[href^='https://']]/prose:inline-block sm:-top-2"
      >
        <ExternalLink />
      </span>
    </a>
  )
}
