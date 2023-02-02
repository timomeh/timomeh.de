import * as React from 'react'
import { MDXRemote, MDXRemoteProps, compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'
import Image from 'next/image'
import probeImageSize from 'probe-image-size'
import { motion } from 'framer-motion'

import * as syntax from '@/lib/syntax'
import { slugify } from '@/lib/slugify'
import { FloatingFootnote } from './FloatingFootnote'
import { FootnoteRef } from './FootnoteRef'

type Props = {
  content: string
  shiftHeadings?: boolean
  inline?: boolean
  scope?: string | number
}

type MDXComponents = MDXRemoteProps['components']

export function MDXRenderer({ content, shiftHeadings, inline, scope }: Props) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MDXRemote
        source={content}
        compiledSource=""
        components={{
          ...components({ scope }),
          ...(shiftHeadings ? shiftedHeadings : headings),
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
      return (
        <figure className="md:-mx-4">
          <div className="relative">
            <Image
              src={props.src!}
              width={result.width}
              height={result.height}
              alt={props.alt || ''}
              className="m-0 rounded-lg"
            />
            <Image
              src={props.src!}
              width={result.width}
              height={result.height}
              alt=""
              className="absolute inset-0 m-0 filter blur-lg z-[-1] opacity-50"
              aria-hidden={true}
            />
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

      const lang = props.className.replace('language-', '')
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

      return <a {...props} />
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

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}

function slugifiedHeading(
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  const HeadingComponent = element
  const { children } = props
  const text = getInnerText(children)
  const slug = slugify(text)
  return (
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
}

function getInnerText(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.reduce<string>((previous: string, current: JSX.Element) => {
      return `${previous}${getInnerText(current)}`
    }, '')
  }

  if (
    Object.prototype.hasOwnProperty.call(node, 'props') &&
    Object.prototype.hasOwnProperty.call(
      (node as JSX.Element).props,
      'children'
    )
  ) {
    return getInnerText((node as JSX.Element).props.children)
  }

  return ''
}
