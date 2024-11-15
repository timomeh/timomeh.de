type Props = {
  children: React.ReactNode
  term: string
}

export function Definition(props: Props) {
  return (
    <>
      <dt>{props.term}</dt>
      <dd>{props.children}</dd>
    </>
  )
}
