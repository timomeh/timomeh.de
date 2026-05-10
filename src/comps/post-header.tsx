type Props = {
  publishedAt: Date
}

export function PostHeader({ publishedAt }: Props) {
  return (
    <div className="text-sm opacity-70">
      <time>
        {new Date(publishedAt).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}
      </time>
    </div>
  )
}
