type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <aside
      className="sm:mt-9 sm:h-full"
      aria-label="Filter by years, change sort, browse tags"
    >
      {children}
    </aside>
  )
}
