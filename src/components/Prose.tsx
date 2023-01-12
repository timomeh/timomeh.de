import clsx from 'clsx'

type Props = {
  children: React.ReactNode
}

export function Prose({ children }: Props) {
  return (
    <div
      className={clsx(
        'prose prose-slate',
        'prose-pre:bg-slate-50',
        'prose-code:bg-fuchsia-100 prose-code:text-fuchsia-900 prose-code:py-0.5 prose-code:px-1 prose-code:rounded-md prose-code:mx-0.5 prose-code:before:content-none prose-code:after:content-none prose-code:font-medium',
        'prose-a:decoration-fuchsia-400/40 prose-a:decoration-2 hover:prose-a:decoration-fuchsia-400/100 prose-a:underline-offset-2 prose-a:no-underline [&:not([data-footnote-ref])]:prose-a:underline prose-a:transition-colors',
        'prose-headings:font-display'
      )}
    >
      {children}
    </div>
  )
}
