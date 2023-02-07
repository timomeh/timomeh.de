import * as React from 'react'
import { MDXRemote, MDXRemoteProps, compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'
import Image from 'next/image'
import probeImageSize from 'probe-image-size'

import * as syntax from '@/lib/syntax'
import { slugify } from '@/lib/slugify'
import { FloatingFootnote } from './FloatingFootnote'
import { FootnoteRef } from './FootnoteRef'
import { TocMarker } from './Toc'
import { getInnerText } from '@/lib/jsx'
import clsx from 'clsx'
import Link from 'next/link'

type Props = {
  content: string
  shiftHeadings?: boolean
  inline?: boolean
  scope?: string | number
  hasToc?: boolean
}

type MDXComponents = MDXRemoteProps['components']

export function MDXRenderer({
  content,
  shiftHeadings,
  inline,
  hasToc,
  scope,
}: Props) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MDXRemote
        source={content}
        compiledSource=""
        components={{
          ...components({ scope }),
          ...(shiftHeadings ? shiftedHeadings : headings),
          ...(hasToc && tocHeadings),
          ...(inline && inlineComponents),
        }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkUnwrapImages],
            remarkRehypeOptions: {
              clobberPrefix: `content-footnote${scope || ''}-`,
            },
          },
        }}
      />
    </>
  )
}

const components = (baseProps: Pick<Props, 'scope'>): MDXComponents => {
  return {
    // @ts-expect-error Server Component
    img: async (props) => {
      const result = await probeImageSize(props.src!)
      let figcaption: JSX.Element | undefined

      if (props.title) {
        const result = await compileMDX({
          source: props.title,
          components: {
            ...components,
            p: ({ children }) => <>{children}</>,
          },
          compiledSource: '',
        })
        figcaption = result.content
      }

      const isFancy = !props.className?.includes('simple')

      return (
        <figure className="md:-mx-4">
          <div className="relative">
            <Image
              src={props.src!}
              width={result.width}
              height={result.height}
              alt={props.alt || ''}
              className={clsx('m-0', isFancy && 'rounded-lg')}
            />
            {isFancy && (
              <Image
                src={props.src!}
                width={result.width}
                height={result.height}
                alt=""
                className="absolute inset-0 m-0 filter blur-lg z-[-1] opacity-50"
                aria-hidden={true}
              />
            )}
          </div>
          {figcaption && (
            <figcaption className="px-8 text-center">{figcaption}</figcaption>
          )}
        </figure>
      )
    },

    // @ts-expect-error Server Component
    code: async (props) => {
      if (!props.className || typeof props.children !== 'string') {
        return (
          <code
            {...props}
            className="bg-emerald-400/10 text-emerald-50 font-medium px-[5px] py-[3px] -mx-[3px]"
          />
        )
      }

      let lang: string | undefined = props.className.replace('language-', '')
      if (['text', 'txt', 'plain'].includes(lang)) lang = undefined
      const html = await syntax.highlight(props.children, lang)

      return (
        <pre
          className="bg-[#1a1b26] border border-violet-400/10 bg-opacity-60 not-prose p-4 md:-mx-4 shadow-violet-300/10 [box-shadow:0_0_24px_var(--tw-shadow-color)] rounded-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )
    },
    pre: (props) => {
      return <>{props.children}</>
    },
    li: (props) => {
      if (props.id?.startsWith('content-footnote')) {
        return (
          <FloatingFootnote id={props.id!} scope={baseProps.scope}>
            {props.children}
          </FloatingFootnote>
        )
      }
      return <li {...props} />
    },
    a: (props) => {
      if ('data-footnote-backref' in props) {
        return <a {...props} className="sr-only focus-visible:not-sr-only" />
      }

      if ('data-footnote-ref' in props) {
        return <FootnoteRef {...props} id={props.id!} scope={baseProps.scope} />
      }

      if (
        props.href?.startsWith('https://timomeh.de') ||
        props.href?.startsWith('/')
      ) {
        const { href, ref: _, ...rest } = props
        return <Link href={href!.replace('https://timomeh.de', '')} {...rest} />
      }

      return <a {...props} className="break-words" rel="noopener noreferrer" />
    },
    section: (props) => {
      if ('data-footnotes' in props) {
        return <section {...props} />
      }

      return <section {...props} />
    },
  }
}

const shiftedHeadings: MDXComponents = {
  h1: (props) => slugifiedHeading('h2', props),
  h2: (props) => slugifiedHeading('h3', props),
  h3: (props) => slugifiedHeading('h4', props),
  h4: (props) => slugifiedHeading('h5', props),
  h5: (props) => slugifiedHeading('h6', props),
  h6: (props) => slugifiedHeading('h6', props),
}

const headings: MDXComponents = {
  h1: (props) => slugifiedHeading('h1', props),
  h2: (props) => slugifiedHeading('h2', props),
  h3: (props) => slugifiedHeading('h3', props),
  h4: (props) => slugifiedHeading('h4', props),
  h5: (props) => slugifiedHeading('h5', props),
  h6: (props) => slugifiedHeading('h6', props),
}

const tocHeadings: MDXComponents = {
  h2: (props) => slugifiedHeading('h2', props, { hasToc: true }),
}

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}

function slugifiedHeading(
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
  { hasToc = false } = {}
) {
  const HeadingComponent = element
  const { children } = props
  const text = getInnerText(children)
  const slug = slugify(text)

  if (element === 'h1') {
    // for static pages
    return (
      <HeadingComponent className="text-2xl leading-snug font-bold font-display">
        {children}
      </HeadingComponent>
    )
  }

  const heading = (
    <HeadingComponent>
      <a
        href={`#${slug}`}
        id={slug}
        className="relative !no-underline !bg-none before:content-['#'] before:absolute before:left-0 before:pr-5 before:-ml-5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:text-emerald-400/60"
      >
        {children}
      </a>
    </HeadingComponent>
  )

  if (hasToc && children !== 'Footnotes') {
    return <TocMarker name={slug}>{heading}</TocMarker>
  }

  return heading
}
