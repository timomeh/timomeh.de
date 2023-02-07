type Props = {
  type: 'posts' | 'offtopic'
}

export function Feeds({ type }: Props) {
  return (
    <>
      <link
        rel="alternate"
        type="application/atom+xml"
        href={`https://timomeh.de/${type}/feed.atom`}
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        href={`https://timomeh.de/${type}/feed.rss`}
      />
      <link
        rel="alternate"
        type="application/feed+json"
        href={`https://timomeh.de/${type}/feed.json`}
      />
    </>
  )
}
