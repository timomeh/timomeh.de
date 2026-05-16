import Link from 'next/link'

import { ArrowBoxUpIcon } from '@/comps/icons/arrow-box-up'

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export function Anchor(props: Props) {
  const isLocalLink =
    props.href?.startsWith('https://timomeh.de') ||
    props.href?.startsWith('/') ||
    props.href?.startsWith('#')
  const isFeedLink = /\.(json|atom|rss|xml)$/.test(props.href || '')

  if (props.href && isLocalLink && !isFeedLink) {
    const { href, ref: _, children, ...rest } = props
    return (
      <Link {...rest} href={href.replace('https://timomeh.de', '')}>
        {children}
      </Link>
    )
  }

  // external links. shows an external link indicator, but only for h1's

  return (
    <a
      {...props}
      className="group/link [&>.external-link]:hidden [&[href^='https://']>.external-link]:inline"
      rel="noopener noreferrer"
      target="_blank"
    >
      {props.children}
      <ArrowBoxUpIcon aria-label="External link" />
    </a>
  )
}
