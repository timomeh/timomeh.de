'use client'

type Props = {
  reset: () => void
}

export default function Error(_props: Props) {
  return <p>500 internal server error {':('}</p>
}
