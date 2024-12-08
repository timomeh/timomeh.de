type Props = {
  children: React.ReactNode
  crtTitle?: boolean
}

export function Prose({ children, crtTitle }: Props) {
  return (
    <div
      data-crt={crtTitle}
      className="dark:prose-h1:data-[crt=true]:effect-crt-blue prose prose-stone
        underline-offset-2 dark:prose-invert prose-headings:text-balance
        prose-headings:font-display prose-headings:font-semibold
        prose-headings:leading-tight prose-h1:text-2xl prose-h1:leading-tight
        prose-a:break-words prose-figcaption:-mt-5 prose-em:text-[var(--tw-prose-bold)]
        prose-kbd:bg-white/30 sm:prose-h1:text-3xl md:prose-figure:-mx-4
        md:prose-figcaption:px-4 dark:prose-h1:data-[crt=true]:font-pixel
        dark:prose-h1:data-[crt=true]:text-4xl dark:prose-h1:data-[crt=true]:font-bold
        dark:prose-h1:data-[crt=true]:leading-none dark:prose-kbd:bg-black/20
        [&_a[href^='https://']>.external-link]:prose-h1:inline-block
        [&_a]:prose-headings:font-semibold [&_a]:prose-headings:decoration-beige
        [&_a]:prose-headings:underline-offset-4
        dark:[&_a]:prose-headings:decoration-purple-300"
    >
      {children}
    </div>
  )
}
