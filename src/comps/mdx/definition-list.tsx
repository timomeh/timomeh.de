type Props = {
  children: React.ReactNode
}

export function DefinitionList(props: Props) {
  return <dl>{props.children}</dl>
}
