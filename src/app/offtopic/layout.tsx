import { NorthernLights } from '@/components/NorthernLights'

type Props = {
  children: React.ReactNode
  aside: React.ReactNode
}

export default function OfftopicLayout({ children, aside }: Props) {
  return (
    <>
      <NorthernLights />
      <main className="meh-main">
        <div className="h-16 lg:hidden" />
        {children}
      </main>
      <aside className="meh-aside">{aside}</aside>
    </>
  )
}
