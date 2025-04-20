import { RandomKicker } from '../../random-kicker'

export default function Page() {
  return <RandomKicker />
}

export async function generateStaticParams() {
  return []
}
