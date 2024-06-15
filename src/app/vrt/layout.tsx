type Props = {
  children: React.ReactNode
}

export default function VrtLayout({ children }: Props) {
  return (
    <div className="[grid-area:main]">
      <div className="signal-hide-header" />
      {children}
    </div>
  )
}
