type Props = {
  children: React.ReactNode
  top: React.ReactNode
  aside: React.ReactNode
}

export default function PostsLayout({ children, top, aside }: Props) {
  return (
    <>
      {top}
      <main className="meh-main">{children}</main>
      <aside className="meh-aside">{aside}</aside>
    </>
  )
}
