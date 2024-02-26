import Link from 'next/link'

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export function Anchor(props: Props) {
  const isLocalLink =
    props.href?.startsWith('https://timomeh.de') || props.href?.startsWith('/')
  const isFeedLink = /\.(json|atom|rss)$/.test(props.href || '')

  if (isLocalLink && !isFeedLink) {
    const { href, ref: _, ...rest } = props
    return (
      <Link
        className="break-words"
        href={href!.replace('https://timomeh.de', '')}
        {...rest}
      />
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
