import React from 'react'

export function FootnotesSection(props: {
  children: React.ReactNode
  startCount?: number
  scope?: string
}) {
  const { children, scope, startCount } = props

  const footnotes = React.Children.toArray(children)

  return (
    <section
      role="region"
      className="border-t border-white/10 pt-4"
      aria-labelledby={`fn-heading${scope || ''}-${startCount}`}
    >
      <h3 id={`fn-heading${scope || ''}-${startCount}`} className="sr-only">
        Footnotes for Section Heading
      </h3>
      <ol
        className="prose-sm prose-li:marker:font-pixel
          prose-li:marker:text-[11px] dark:prose-li:marker:text-white/60"
        start={props.startCount || 1}
      >
        {footnotes.map((footnote, index) => {
          return <li key={index}>{footnote}</li>
        })}
      </ol>
    </section>
  )
}

export function FootnoteReference(props: { count: number; scope?: string }) {
  return (
    <sup
      id={createFootnoteReferenceId(props.count, props.scope)}
      className="group/footnoteref relative"
    >
      <span
        aria-hidden
        className="absolute -top-px -left-[3px] z-[-1] block h-4 w-4
          rounded-full bg-sky-400/50 opacity-0 transition-opacity delay-300
          ![animation-fill-mode:forwards] ![animation-iteration-count:5]
          group-target/footnoteref:animate-ping
          group-target/footnoteref:opacity-100 dark:bg-sky-200/10"
      />
      <a
        className="font-pixel pl-0.5 text-[11px] break-words no-underline
          dark:text-white/50"
        aria-describedby={`fn-${props.count}-${props.scope || ''}label`}
        href={`#${createFootnoteContentId(props.count, props.scope)}`}
      >
        {props.count}
      </a>
    </sup>
  )
}

export function FootnoteContent(props: {
  count: number
  scope?: string
  children: React.ReactNode
}) {
  return (
    <div
      id={createFootnoteContentId(props.count, props.scope)}
      className="group/footnote relative"
    >
      <span
        aria-hidden
        className="absolute inset-0 -left-7 z-[-1] block bg-sky-400/20 opacity-0
          transition-opacity delay-300 group-target/footnote:opacity-100
          dark:bg-sky-200/10"
      />
      <span
        id={`fn-${props.count}-${props.scope || ''}label`}
        className="sr-only"
      >
        Footnote {props.count}:{' '}
      </span>
      {props.children}{' '}
      <a
        aria-label={`Back to reference ${props.count}`}
        className="font-pixel text-opacity-50 pl-0.5 text-[13px] break-words
          text-current no-underline"
        href={`#${createFootnoteReferenceId(props.count, props.scope)}`}
      >
        ↑
      </a>
    </div>
  )
}

function createFootnoteReferenceId(count: number, scope?: string) {
  return `fn-ref${scope || ''}-${String(count)}`
}

function createFootnoteContentId(count: number, scope?: string) {
  return `fn${scope || ''}-${String(count)}`
}
