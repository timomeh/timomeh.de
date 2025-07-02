type Props = {
  children: React.ReactNode
  caption?: string
  shadow?: boolean
}

export function Figure(props: Props) {
  return (
    <figure
      data-shadow={props.shadow}
      className="group/figure md:not-has-[code]:-mx-4"
    >
      {props.children}
      {props.caption && (
        <figcaption className="-mt-5 md:group-not-has-[code]/figure:px-4">
          {props.caption}
        </figcaption>
      )}
    </figure>
  )
}
