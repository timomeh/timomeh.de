import { getInnerText } from '@/lib/jsx'
import { slugify } from '@/lib/slugify'

type Props = {
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>

export function Heading({ element, ...rest }: Props) {
  const HeadingComponent = element

  // Turn headlines text into linkable slugs
  const { children } = rest
  const text = getInnerText(children)
  const slug = slugify(text)

  if (element === 'h1') {
    // only used in static pages
    return (
      <HeadingComponent className="text-balance font-display font-semibold leading-tight">
        {children}
      </HeadingComponent>
    )
  }

  return (
    <HeadingComponent className="text-balance font-display font-semibold leading-tight">
      <a href={`#${slug}`} id={slug} className="font-semibold no-underline">
        {children}
      </a>
    </HeadingComponent>
  )
}
