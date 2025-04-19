type Props = {
  publishedAt: Date
  readingTime: string
}

export function PostHeader({ publishedAt, readingTime }: Props) {
  return (
    <div className="mb-2 text-sm">
      <time>
        {new Date(publishedAt).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}
      </time>
      <span>{' · '}</span>
      <span>{readingTime}</span>
    </div>
  )
}
