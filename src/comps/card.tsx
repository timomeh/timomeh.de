type Props = {
  children: React.ReactNode
}

export function Card({ children }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-gray-400/30 bg-[#FDFDFD]/30
        backdrop-brightness-105 dark:border-gray-800/30 dark:bg-[#191A22]/20"
    >
      {children}
    </div>
  )
}
