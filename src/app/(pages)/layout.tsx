import { Footer } from '@/app/_comps/footer'
import { HeaderBackdropHaze } from '@/app/_comps/header-backdrop-haze'
import { HeaderSpacer } from '@/app/_comps/header-spacer'

type Props = {
  children: React.ReactNode
}

export default function PagesLayout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderSpacer>
        <HeaderBackdropHaze />
      </HeaderSpacer>
      {children}
      <Footer />
    </div>
  )
}
