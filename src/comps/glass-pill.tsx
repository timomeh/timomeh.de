type Props = {
  children: React.ReactNode
}

export function GlassPill({ children }: Props) {
  return (
    <div
      className="shadow-beige/15 relative isolate overflow-hidden rounded-full border
        border-x-[#E8CABE] border-t-[#EEDED8] border-b-[#E8CABE] shadow-md
        dark:border-x-[#213A31] dark:border-t-[#28493D] dark:border-b-[#1E2F2A]
        dark:shadow-gray-950/50"
    >
      <div className="absolute inset-0 z-10 bg-orange-200 dark:bg-emerald-950" />
      <div className="page-bg absolute inset-0 z-20 opacity-80" />
      <div
        className="font-display xs:text-sm relative z-30 px-3 py-1 text-center text-xs font-medium
          text-amber-950 tabular-nums opacity-70 dark:text-emerald-200 dark:antialiased
          **:[em]:not-italic **:[em]:opacity-70"
      >
        {children}
      </div>
    </div>
  )
}
