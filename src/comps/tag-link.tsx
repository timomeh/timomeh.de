import Link from 'next/link'

export function TagLink({
  slug,
  title,
  color,
  prefetch,
}: {
  slug: string
  title: string
  color: string | null
  prefetch?: boolean
}) {
  return (
    <Link
      href={`/tags/${slug}`}
      prefetch={prefetch}
      style={
        color
          ? {
              color: `color-mix(in srgb, ${color}, currentColor 40%)`,
            }
          : undefined
      }
      className="brightness-90 saturate-200 hover:underline dark:brightness-110"
    >
      {title}
    </Link>
  )
}
