export function getInnerText(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.reduce<string>((previous: string, current: JSX.Element) => {
      return `${previous}${getInnerText(current)}`
    }, '')
  }

  if (
    Object.prototype.hasOwnProperty.call(node, 'props') &&
    Object.prototype.hasOwnProperty.call(
      (node as JSX.Element).props,
      'children'
    )
  ) {
    return getInnerText((node as JSX.Element).props.children)
  }

  return ''
}
