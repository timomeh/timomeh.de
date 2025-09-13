type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <nav className="sm:h-full" aria-label="Naviation">
      {children}
    </nav>
  )
}
