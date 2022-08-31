type Props = {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:py-8 xl:py-16 mx-auto">
        {children}
      </div>
    </div>
  )
}
