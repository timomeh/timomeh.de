import * as React from 'react'
import { MDXRemote, MDXRemoteProps, compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkEmbedder, { TransformerInfo } from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import Image from 'next/image'
import probeImageSize from 'probe-image-size'
import Balancer from 'react-wrap-balancer'
import { BookmarkIcon } from '@heroicons/react/24/outline'

import * as syntax from '@/lib/syntax'
import { slugify } from '@/lib/slugify'
import { FloatingFootnote } from './FloatingFootnote'
import { FootnoteRef } from './FootnoteRef'
import { TocMarker } from './Toc'
import { getInnerText } from '@/lib/jsx'
import clsx from 'clsx'
import Link from 'next/link'
import rehypeRaw from 'rehype-raw'

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
        components={{
          ...components({ scope }),
          ...(shiftHeadings ? shiftedHeadings : headings),
          ...(hasToc && tocHeadings),
          ...(inline && inlineComponents),
        }}
        options={{
          mdxOptions: {
            format: 'md',
            remarkPlugins: [
              remarkGfm,
              remarkUnwrapImages,
              [
                remarkEmbedder,
                {
                  transformers: [oembedTransformer],
                  handleHTML,
                },
              ],
            ],
            rehypePlugins: [rehypeRaw],
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
            ...components(baseProps),
            p: ({ children }) => <>{children}</>,
          },
        })
        figcaption = result.content
      }

      const isFancy =
        !props.className?.includes('simple') &&
        !props.className?.includes('plain')

      return (
        <figure className="md:-mx-4">
          <div className="relative">
            <Image
              src={props.src!}
              width={result.width}
              height={result.height}
              alt={props.alt || ''}
              className={clsx('my-0 mx-auto', isFancy && 'rounded-lg')}
            />
            {isFancy && (
              <Image
                src={props.src!}
                width={result.width}
                height={result.height}
                alt=""
                className="absolute inset-0 m-0 filter blur-lg z-[-1] opacity-30 mx-auto select-none"
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

    video: (props) => {
      return (
        <div className="md:-mx-4">
          <video {...props} className="rounded-lg my-0 mx-auto" />
        </div>
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
          className="bg-[#1a1b26] my-12 border border-violet-400/10 bg-opacity-60 not-prose p-4 md:-mx-4 shadow-violet-300/10 [box-shadow:0_0_24px_var(--tw-shadow-color)] rounded-lg"
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
          <FloatingFootnote
            id={props.id!}
            scope={baseProps.scope}
            key={props.id!}
          >
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
        (props.href?.startsWith('https://timomeh.de') ||
          props.href?.startsWith('/')) &&
        !/\.(json|atom|rss)$/.test(props.href)
      ) {
        const { href, ref: _, ...rest } = props
        return (
          <Link
            className="break-words"
            href={href!.replace('https://timomeh.de', '')}
            {...rest}
          />
        )
      }

      return (
        <a
          {...props}
          className="break-words"
          rel="noopener noreferrer"
          target="_blank"
        />
      )
    },
    section: (props) => {
      if ('data-footnotes' in props) {
        return <section {...props} />
      }

      return <section {...props} />
    },
    del: (props) => {
      return <del className="text-gray-500" {...props} />
    },
  }
}

const shiftedHeadings: MDXComponents = {
  h1: (props) => <SlugifiedHeading element="h2" {...props} />,
  h2: (props) => <SlugifiedHeading element="h3" {...props} />,
  h3: (props) => <SlugifiedHeading element="h4" {...props} />,
  h4: (props) => <SlugifiedHeading element="h5" {...props} />,
  h5: (props) => <SlugifiedHeading element="h6" {...props} />,
  h6: (props) => <SlugifiedHeading element="h6" {...props} />,
}

const headings: MDXComponents = {
  h1: (props) => <SlugifiedHeading element="h1" {...props} />,
  h2: (props) => <SlugifiedHeading element="h2" {...props} />,
  h3: (props) => <SlugifiedHeading element="h3" {...props} />,
  h4: (props) => <SlugifiedHeading element="h4" {...props} />,
  h5: (props) => <SlugifiedHeading element="h5" {...props} />,
  h6: (props) => <SlugifiedHeading element="h6" {...props} />,
}

const tocHeadings: MDXComponents = {
  h2: (props) => <SlugifiedHeading element="h2" {...props} hasToc />,
}

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}

type SlugifiedHeadingProps = {
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  hasToc?: boolean
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>

function SlugifiedHeading({ element, hasToc, ...rest }: SlugifiedHeadingProps) {
  const HeadingComponent = element
  const { children } = rest
  const text = getInnerText(children)
  const slug = slugify(text)

  if (element === 'h1') {
    // for static pages
    return (
      <HeadingComponent className="text-2xl leading-snug font-bold font-display">
        <Balancer>{children}</Balancer>
      </HeadingComponent>
    )
  }

  const heading = (
    <HeadingComponent>
      <a
        href={`#${slug}`}
        id={slug}
        className="inline-block relative !no-underline !bg-none group"
      >
        <div className="w-5 h-3.5 absolute -left-5 pr-1.5 top-[0.7ch] opacity-0 duration-500 transition-all delay-300 scale-75 group-hover:scale-100 group-hover:opacity-100">
          <div className="absolute left-0 top-0 w-3.5 h-3.5">
            <BookmarkIcon className="text-emerald-500 absolute inset-0" />
            <BookmarkIcon className="text-emerald-500 blur-[2px] absolute inset-0" />
          </div>
        </div>
        <Balancer>{children}</Balancer>
      </a>
    </HeadingComponent>
  )

  if (hasToc && children !== 'Footnotes') {
    return <TocMarker name={slug}>{heading}</TocMarker>
  }

  return heading
}

function handleHTML(html: string, info: TransformerInfo) {
  const { url, transformer } = info
  if (
    transformer.name === '@remark-embedder/transformer-oembed' ||
    url.includes('youtube.com')
  ) {
    return `<div className="oembed oembed-youtube aspect-video rounded-lg overflow-hidden md:-mx-4">${html.replace(
      'youtube.com',
      'youtube-nocookie.com'
    )}</div>`
  }
  return html
}
