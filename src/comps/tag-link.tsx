import Link from 'next/link'

export function TagLink({
  slug,
  title,
  color,
}: {
  slug: string
  title: string
  color: string | null
}) {
  return (
    <Link
      href={`/tags/${slug}`}
      style={
        color
          ? {
              color: `color-mix(in srgb, ${color}, currentColor 40%)`,
            }
          : undefined
      }
      className="brightness-90 saturate-150 hover:underline dark:brightness-125"
    >
      {title}
    </Link>
  )
}
