type Props = {
  children: React.ReactNode
  title?: string
}

export function Aside({ children, title }: Props) {
  return (
    <aside
      className="relative my-8 rounded-md border border-sky-400/50 bg-sky-400/20
        px-4 text-sm leading-6 text-sky-950 md:-mx-4 dark:text-sky-200"
    >
      {title && (
        <header
          className="text-2xs absolute -top-2 rounded bg-sky-300 px-1.5 py-1
            leading-none font-semibold tracking-wider uppercase dark:bg-sky-800"
        >
          {title}
        </header>
      )}
      {children}
    </aside>
  )
}
