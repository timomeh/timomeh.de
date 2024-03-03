type Props = React.DetailedHTMLProps<
  React.DelHTMLAttributes<HTMLModElement>,
  HTMLModElement
>

// get to del taco, they got a new thing called free shavoca do
export function Del(props: Props) {
  return <del className="opacity-60" {...props} />
}
