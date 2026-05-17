// oxlint-disable jsx_a11y/no-static-element-interactions
// oxlint-disable jsx_a11y/click-events-have-key-events
// oxlint-disable jsx_a11y/anchor-has-content
'use client'

export function PreventScrollLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <a
      onClick={(e) => {
        e.preventDefault()

        // can't use pushState here because lol: https://timomeh.de/posts/url-fragments-and-push-state-are-weird
        // instead it needs some trickery to trigger the hash without scrolling
        const { scrollX, scrollY } = window
        location.hash = props.href?.replace('#', '') ?? ''
        window.scrollTo(scrollX, scrollY)
      }}
      {...props}
    />
  )
}
