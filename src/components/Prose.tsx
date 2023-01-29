import clsx from 'clsx'

type Props = {
  children: React.ReactNode
  big?: boolean
}

export function Prose({ children, big }: Props) {
  return (
    <div
      className={clsx(
        'prose prose-purple prose-invert mx-4',
        'prose-headings:font-display',
        big && 'prose-lg leading-relaxed max-w-[650px]',
        'prose-a:text-inherit prose-a:glow prose-a:font-semibold prose-a:underline prose-a:underline-offset-2 prose-a:decoration-violet-400',
        'prose-code:before:content-none prose-code:after:content-none'
      )}
    >
      {children}
    </div>
  )
}
