type Props = {
  children: React.ReactNode
  size?: 'sm'
}

export function Prose({ children, size }: Props) {
  return (
    <div
      data-size={size}
      className="prose data-[size=sm]:prose-sm sm:data-[size=sm]:prose prose-stone
        dark:prose-invert! prose-headings:text-balance
        prose-headings:font-serif prose-headings:font-semibold prose-h1:text-2xl
        sm:prose-h1:text-3xl prose-a:break-words
        prose-em:text-[var(--tw-prose-bold)] prose-kbd:bg-white/30
        dark:prose-kbd:bg-black/20
        prose-h1:[&_a[href^='https://']>.external-link]:inline-block
        prose-headings:[&_a]:font-semibold prose-headings:[&_a]:decoration-beige
        prose-headings:[&_a]:underline-offset-4
        dark:prose-headings:[&_a]:decoration-purple-300 underline-offset-2"
    >
      {children}
    </div>
  )
}
