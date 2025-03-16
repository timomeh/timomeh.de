type Props = {
  children: React.ReactNode
  padded?: boolean
}

export function Card({ children, padded = true }: Props) {
  return (
    <div
      className="border-t-beige/20 border-x-beige/30 border-b-beige/40 shadow-beige/15 relative
        isolate max-w-full overflow-hidden rounded-xl border border-x-0 shadow-md
        sm:border-x dark:border-x-gray-300/13 dark:border-t-gray-300/20
        dark:border-b-gray-300/10 dark:shadow-gray-950/50"
    >
      <div className="absolute inset-0 z-10 backdrop-blur-lg backdrop-brightness-110" />
      <div className="page-bg absolute inset-0 z-20 opacity-50" />
      <div
        data-padded={padded}
        className="relative z-30 data-[padded=true]:py-6 data-[padded=true]:sm:px-6
          data-[padded=true]:sm:py-10"
      >
        {children}
      </div>
    </div>
  )
}
