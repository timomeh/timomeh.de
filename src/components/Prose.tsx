import clsx from 'clsx'

type Properties = {
  children: React.ReactNode
  size?: 'big' | 'smol' | 'yes'
}

export function Prose({ children, size = 'yes' }: Properties) {
  return (
    <div
      className={clsx(
        'prose prose-purple prose-invert relative max-w-[620px]',
        '[hyphenate-limit-chars:6_3_2] [hyphenate-limit-last:always] [hyphenate-limit-lines:2] [hyphens:auto]',
        'prose-headings:font-display',
        size === 'big' && 'prose-lg leading-relaxed',
        size === 'smol' && 'prose-sm leading-snug prose-p:my-1',
        'prose-a:glow prose-a:font-semibold prose-a:text-inherit prose-a:underline prose-a:decoration-violet-400 prose-a:underline-offset-2',
        'prose-code:before:content-none prose-code:after:content-none',
      )}
    >
      {children}
    </div>
  )
}
