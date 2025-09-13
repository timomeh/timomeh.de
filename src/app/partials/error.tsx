'use client'

type Props = {
  reset: () => void
}

export default function ErrorFragment(_props: Props) {
  return <p>500 internal server error {':('}</p>
}
