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
  bottom,
  top,
}: Props) {
  if (current < 1 && !hasOlderPost) {
    return null
  }

  return (
    <>
      {bottom && (
        <div className="relative z-[-1]" aria-hidden={true}>
          <div
            className="absolute left-0 right-0 -mb-14 h-14 bg-gradient-to-b from-black/30
              to-transparent"
          />
        </div>
      )}
      <div className="mx-auto flex w-full max-w-2xl justify-between px-4 py-2 font-pixel">
        {current > 0 ? (
          <Link
            href={current === 1 ? `${scope}/` : `${scope}/page/${current - 1}`}
            className="opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <span className="effect-crt-blue">← Newer</span>
          </Link>
        ) : (
          <div />
        )}
        {hasOlderPost ? (
          <Link
            href={`${scope}/page/${current + 1}`}
            className="opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <span className="effect-crt-blue">Older →</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
      {top && (
        <div className="relative z-[-1]" aria-hidden={true}>
          <div
            className="absolute left-0 right-0 -mt-14 h-14 bg-gradient-to-t from-black/30
              to-transparent"
          />
        </div>
      )}
    </>
  )
}
