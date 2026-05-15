import { KeyboardNavLink } from '@/comps/keyboard-nav-link'

type Props = {
  children: React.ReactNode
}

export function PageMain({ children }: Props) {
  return (
    <div id="main">
      <div className="relative">
        <KeyboardNavLink href="#nav" className="max-sm:hidden">
          Jump back to navigation
        </KeyboardNavLink>
        <main id="content" className="h-full">
          {children}
        </main>
      </div>
    </div>
  )
}
