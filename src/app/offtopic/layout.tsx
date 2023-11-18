import { GenericHeader } from '@/components/GenericHeader'

type Props = {
  children: React.ReactNode
  aside: React.ReactNode
}

export default function OfftopicLayout({ children, aside }: Props) {
  return (
    <>
      <GenericHeader />
      <main className="meh-main">{children}</main>
      <aside className="meh-aside">{aside}</aside>
    </>
  )
}
