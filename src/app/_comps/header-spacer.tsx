type Props = {
  children?: React.ReactNode
}

export function HeaderSpacer({ children }: Props) {
  return <div className="relative h-40 sm:h-44">{children}</div>
}
