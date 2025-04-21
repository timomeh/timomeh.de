import { HeaderLayout } from './header-layout'

type Props = {
  kicker: React.ReactNode
  backdrop: React.ReactNode
}

export default function Layout({ kicker, backdrop }: Props) {
  return <HeaderLayout backdrop={backdrop} kicker={kicker} />
}
