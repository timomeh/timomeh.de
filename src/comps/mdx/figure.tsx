type Props = {
  children: React.ReactNode
  caption: string
}

export function Figure(props: Props) {
  return (
    <figure>
      {props.children}
      <figcaption>{props.caption}</figcaption>
    </figure>
  )
}
