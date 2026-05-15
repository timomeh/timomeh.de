import { SearchDialog } from '../search-dialog'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  // it's important that this is in a layout so the dialog element doesn't rerender
  // when the query param changes
  return <SearchDialog>{children}</SearchDialog>
}
