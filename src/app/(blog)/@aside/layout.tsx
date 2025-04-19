import { unstable_ViewTransition as ViewTransition } from 'react'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return <ViewTransition name="sidebar">{children}</ViewTransition>
}
