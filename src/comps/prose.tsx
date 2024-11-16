type Props = {
  children: React.ReactNode
  crtTitle?: boolean
}

export function Prose({ children, crtTitle }: Props) {
  return (
    <div
      data-crt={crtTitle}
      className="prose-h1:data-[crt=true]:effect-crt-blue prose prose-invert
        prose-headings:text-balance prose-headings:font-display
        prose-headings:font-semibold prose-headings:leading-tight prose-h1:text-2xl
        prose-h1:leading-tight prose-h1:data-[crt=true]:font-pixel
        prose-h1:data-[crt=true]:text-4xl prose-h1:data-[crt=true]:font-bold
        prose-h1:data-[crt=true]:leading-none prose-figcaption:-mt-2
        prose-figcaption:px-2 sm:prose-h1:text-3xl md:prose-figcaption:px-8"
    >
      {children}
    </div>
  )
}