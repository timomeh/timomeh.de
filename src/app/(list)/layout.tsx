import { HeaderSpacer } from '@/comps/header-spacer'
import { PostTags } from './post-tags'
import { HeaderBackdropHaze } from '@/comps/header-backdrop-haze'
import { Footer } from '@/comps/footer'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col self-start [grid-area:main]">
      <HeaderSpacer>
        <HeaderBackdropHaze />
      </HeaderSpacer>
      <main className="relative z-30 w-full flex-1">
        <nav className="mx-auto max-w-2xl px-4 sm:mt-6">
          <PostTags />
        </nav>
        {children}
      </main>
      <Footer />
    </div>
  )
}
