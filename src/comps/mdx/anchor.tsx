import clsx from 'clsx'
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
  const isFootnote = 'data-footnote-ref' in props
  const isFootnoteBack = 'data-footnote-backref' in props

  if (isLocalLink && !isFeedLink) {
    const { href, ref: _, children, ...rest } = props
    return (
      <Link
        {...rest}
        className={clsx(
          'break-words',
          !(isFootnote && isFootnoteBack) && 'text-[#f2f0f3]',
          isFootnote &&
            'rounded-full pl-0.5 font-pixel text-[11px] text-white/60 no-underline',
          isFootnoteBack &&
            'rounded-full pl-0.5 font-pixel text-[13px] text-white/60 no-underline',
        )}
        href={href!.replace('https://timomeh.de', '')}
      >
        {isFootnoteBack ? '↑' : children}
      </Link>
    )
  }

  return (
    <a
      {...props}
      className="break-words"
      rel="noopener noreferrer"
      target="_blank"
    />
  )
}
