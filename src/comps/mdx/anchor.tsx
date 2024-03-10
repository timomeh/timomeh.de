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
  const isFootnoteBack = 'data-footnote-backref' in props

  if (isLocalLink && !isFeedLink) {
    const { href, ref: _, children, ...rest } = props
    return (
      <Link
        {...rest}
        className="break-words data-[footnote-backref]:rounded-full
          data-[footnote-ref]:rounded-full data-[footnote-backref]:pl-0.5
          data-[footnote-ref]:pl-0.5 data-[footnote-backref]:font-pixel
          data-[footnote-ref]:font-pixel data-[footnote-backref]:text-[13px]
          data-[footnote-ref]:text-[11px] data-[footnote-backref]:text-white/50
          data-[footnote-ref]:text-[#f2f0f3] data-[footnote-ref]:text-white/50
          data-[footnote-backref]:no-underline data-[footnote-ref]:no-underline"
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
