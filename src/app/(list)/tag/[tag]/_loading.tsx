export default function Loading() {
  const chars = ['%', '¥', 'Ξ', 'Π', '‖', '⁞⁞⁞']
  const endChar = chars[Math.floor(Math.random() * chars.length)]
  return (
    <main className="mx-auto max-w-2xl px-4">
      <div className="mt-10">
        <h2 className="effect-crt-blue animate-pulse font-pixel text-2xl font-bold leading-none">
          <span className="opacity-50">202{endChar}</span>
        </h2>
        <div className="h-4" />
        <div className="h-px" />
        <div>
          <div className="flex items-center gap-1">
            <div
              className="font-pixel text-2xs leading-none antialiased opacity-50
                [font-feature-settings:'ss01'] sm:text-xs"
            >
              <span className="animate-pulse text-purple-300">▛▙▖▖ ▚▙</span>
            </div>
          </div>
          <div
            className="mt-1 animate-pulse text-balance font-display text-[15px] font-medium
              leading-snug"
          >
            <span className="opacity-50">▙▚▛▞ ▜▝▟ ▗▙▚</span>
          </div>
        </div>
      </div>
    </main>
  )
}
