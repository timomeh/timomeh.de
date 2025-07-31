import { JSX } from 'react'

type Props = JSX.IntrinsicElements['a']

export function KeyboardNavLink({ children, className, ...rest }: Props) {
  return (
    <a
      {...rest}
      className={`sr-only top-0 left-0 z-50 w-auto focus-visible:not-sr-only
        focus-visible:absolute focus-visible:block ${className || ''}`}
    >
      <div
        className="rounded bg-[#a18570] p-1 text-center text-xs font-medium
          lg:text-sm dark:bg-emerald-700"
      >
        {children}
      </div>
    </a>
  )
}
