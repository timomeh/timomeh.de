type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

// get to del taco, they got a new thing called free shavoca do
export function Section(props: Props) {
  if ('data-footnotes' in props) {
    return (
      <section
        {...props}
        className="prose-h2:effect-crt-blue prose-sm mt-10 prose-h2:!mb-0 prose-h2:font-pixel
          prose-h2:text-[15px] prose-h2:opacity-80 prose-li:marker:font-pixel
          prose-li:marker:text-[11px] prose-li:marker:text-white/60 [&_p]:!my-2"
      />
    )
  }

  return <section {...props} />
}
