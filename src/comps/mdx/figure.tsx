type Props = {
  children: React.ReactNode
  caption?: string
  shadow?: boolean
}

export function Figure(props: Props) {
  return (
    <figure data-shadow={props.shadow} className="group/figure">
      {props.children}
      {props.caption && <figcaption>{props.caption}</figcaption>}
    </figure>
  )
}
