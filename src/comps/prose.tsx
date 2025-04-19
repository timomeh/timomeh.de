type Props = {
  children: React.ReactNode
  crtTitle?: boolean
}

export function Prose({ children, crtTitle }: Props) {
  return (
    <div
      data-crt={crtTitle}
      className="prose prose-stone dark:prose-invert prose-headings:text-balance
        prose-headings:font-serif prose-headings:font-semibold prose-h1:text-2xl
        sm:prose-h1:text-3xl prose-a:break-words prose-figcaption:-mt-5
        prose-em:text-[var(--tw-prose-bold)] prose-kbd:bg-white/30 md:prose-figure:-mx-4
        md:prose-figcaption:px-4 dark:prose-kbd:bg-black/20
        prose-h1:[&_a[href^='https://']>.external-link]:inline-block
        prose-headings:[&_a]:font-semibold prose-headings:[&_a]:decoration-beige
        prose-headings:[&_a]:underline-offset-4
        dark:prose-headings:[&_a]:decoration-purple-300 underline-offset-2"
    >
      {children}
    </div>
  )
}
