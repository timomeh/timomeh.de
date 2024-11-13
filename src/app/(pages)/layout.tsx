import { Footer } from '@/comps/footer'
import { HeaderBackdropHaze } from '@/comps/header-backdrop-haze'
import { HeaderSpacer } from '@/comps/header-spacer'

type Props = {
  children: React.ReactNode
}

export default function PagesLayout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col [grid-area:main]">
      <HeaderSpacer>
        <HeaderBackdropHaze />
      </HeaderSpacer>
      {children}
      <Footer />
    </div>
  )
}
