import clsx from 'clsx'

type Props = {
  children: React.ReactNode
}

export function Prose({ children }: Props) {
  return (
    <div
      className={clsx(
        'prose prose-slate prose-sm sm:prose-base',
        'prose-code:bg-fuchsia-100 prose-code:text-fuchsia-900 prose-code:py-0.5 prose-code:px-1 prose-code:rounded-md prose-code:mx-0.5 prose-code:before:content-none prose-code:after:content-none prose-code:font-medium',
        'prose-a:decoration-pink-600/80 prose-a:decoration-2 hover:prose-a:underline prose-a:no-underline',
        'prose-headings:font-display'
      )}
    >
      {children}
    </div>
  )
}
