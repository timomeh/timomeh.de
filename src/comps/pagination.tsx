import Link from 'next/link'

type Props = {
  current: number
  hasOlderPost?: boolean
  scope?: string
  bottom?: boolean
  top?: boolean
}

export function Pagination({
  current,
  hasOlderPost,
  scope = '',
  bottom: _bottom,
  top: _top,
}: Props) {
  if (current < 1 && !hasOlderPost) {
    return null
  }

  return (
    <div
      className="dark:font-pixel mx-auto flex w-full max-w-2xl justify-between px-4 py-2
        font-semibold text-[#a18570] dark:font-normal"
    >
      {current > 0 ? (
        <Link
          href={current === 1 ? `${scope}/` : `${scope}/page/${current - 1}`}
          className="opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="dark:effect-crt-blue">
            <span className="hidden dark:inline">←</span> Newer
          </span>
        </Link>
      ) : (
        <div />
      )}
      {hasOlderPost ? (
        <Link
          href={`${scope}/page/${current + 1}`}
          className="opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="dark:effect-crt-blue">
            Older <span className="hidden dark:inline">→</span>
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
