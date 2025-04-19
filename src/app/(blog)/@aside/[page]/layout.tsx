type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <aside className="sm:h-full" aria-label="Naviation" role="navigation">
      {children}
    </aside>
  )
}
