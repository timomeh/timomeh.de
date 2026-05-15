'use client'

export function SearchControls({ children }: { children: React.ReactNode }) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') return

    const $root = e.currentTarget
    if (!$root) return

    const $input = $root.querySelector<HTMLInputElement>('input[name=query]')
    if (!$input) return

    const $activeElement = document.activeElement as HTMLElement | null
    const isInputActive = $activeElement === $input

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const $results = Array.from(
        $root.querySelectorAll<HTMLAnchorElement>('[data-search-result]'),
      )
      if ($results.length === 0) return

      e.preventDefault()

      const currentResultIndex = $activeElement
        ? $results.indexOf($activeElement as HTMLAnchorElement)
        : -1

      let nextResultIndex: number
      if (e.key === 'ArrowDown') {
        nextResultIndex =
          currentResultIndex < 0
            ? 0
            : (currentResultIndex + 1) % $results.length
      } else {
        if (currentResultIndex <= 0) {
          $input.focus()
          return
        }

        nextResultIndex = currentResultIndex - 1
      }

      $results[nextResultIndex]?.focus()
      return
    }

    if (isInputActive) return

    const isTyping = e.key.length === 1
    if (isTyping || e.key === 'Backspace') {
      $input?.focus()
      return
    }
  }

  return (
    // oxlint-disable-next-line jsx_a11y/no-static-element-interactions
    <div
      onKeyDown={handleKeyDown}
      className="flex min-h-0 flex-col overflow-y-auto"
    >
      {children}
    </div>
  )
}
