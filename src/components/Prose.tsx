import clsx from 'clsx'

type Props = {
  children: React.ReactNode
  size?: 'big' | 'smol' | 'yes'
}

export function Prose({ children, size = 'yes' }: Props) {
  return (
    <div
      className={clsx(
        'prose prose-purple prose-invert relative',
        'prose-headings:font-display',
        size === 'big' && 'prose-lg leading-relaxed max-w-[650px]',
        size === 'smol' && 'prose-sm leading-snug prose-p:my-1',
        'prose-a:text-inherit prose-a:glow prose-a:font-semibold prose-a:underline prose-a:underline-offset-2 prose-a:decoration-violet-400',
        'prose-code:before:content-none prose-code:after:content-none'
      )}
    >
      {children}
    </div>
  )
}
