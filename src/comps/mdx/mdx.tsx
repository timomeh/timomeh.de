import { compile, type evaluate, run } from '@mdx-js/mdx'
import remarkEmbedder, { type TransformerInfo } from '@remark-embedder/core'
import oembedTransformer, {
  type Config,
} from '@remark-embedder/transformer-oembed'
import { memoize } from 'nextjs-better-unstable-cache'
import { Suspense } from 'react'
import * as runtime from 'react/jsx-runtime'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'

import { remarkImageSrcPrefix } from '@/lib/remarkImagePrefix'
import { withMdxFootnotes } from '@/lib/remarkMdxFootnotes'
import { remarkReadMore } from '@/lib/remarkReadMore'

import imgproxyLoader from '../../lib/imgproxyLoader'
import { ClientSideOembed } from '../client-side-oembed'
import { Anchor } from './anchor'
import { Aside } from './aside'
import { Blockquote } from './blockquote'
import { Code } from './code'
import { Definition } from './definition'
import { DefinitionList } from './definition-list'
import { Del } from './del'
import { Figure } from './figure'
import {
  FootnoteContent,
  FootnoteReference,
  FootnotesSection,
} from './footnote'
import { Img } from './img'
import { Kbd } from './kbd'
import { Lead } from './lead'
import { ReadMore } from './read-more'
import { Video } from './video'

type MDXComponents = Parameters<
  Awaited<ReturnType<typeof evaluate>>['default']
>[0]['components']

type Props = {
  content: string
  assetPrefix?: string
  inline?: boolean
  plain?: boolean
  cacheKey?: string
  cacheTags?: string[]
  readMorePath?: string
  scope?: string
  components?: MDXComponents
}

export async function MDX({
  content,
  inline,
  assetPrefix,
  plain,
  readMorePath,
  cacheKey,
  cacheTags,
  scope,
  components = {},
}: Props) {
  const comps: MDXComponents = plain
    ? plainComponents
    : {
        ...baseComponents,
        ...{
          FootnoteContent: (props) => (
            <FootnoteContent {...props} scope={scope} />
          ),
          FootnoteReference: (props) => (
            <FootnoteReference {...props} scope={scope} />
          ),
          FootnotesSection: (props) => (
            <FootnotesSection {...props} scope={scope} />
          ),
        },
        ...(!!readMorePath && {
          ReadMore: () => <ReadMore href={readMorePath} />,
        }),
        ...(inline && inlineComponents),
      }

  const compileUncached = async () => {
    const code = await compile(content, {
      outputFormat: 'function-body',
      rehypePlugins: [rehypeUnwrapImages],
      remarkPlugins: [
        remarkGfm,
        [
          remarkImageSrcPrefix,
          {
            baseUrl: assetPrefix,
          },
        ],
        [
          // @ts-expect-error
          remarkEmbedder,
          {
            transformers: [
              oembedTransformer,
              {
                params: { dnt: true, theme: 'dark', omit_script: false },
              } as Config,
            ],
            handleHTML,
          },
        ],
        !plain ? withMdxFootnotes : () => {},
        // @ts-expect-error
        remarkSmartypants,
        readMorePath ? remarkReadMore : () => {},
      ],
    })

    return String(code)
  }

  const compileCached = memoize(
    async () => {
      const compiled = await compileUncached()
      return compiled
    },
    {
      additionalCacheKey: [
        'compiled-mdx',
        'cached-version:v2', // increase this version if rendered mdx updated
        assetPrefix || 'mdx-no-asset-prefix',
        cacheKey || 'mdx-no-cache-key',
      ],
      revalidateTags: ['mdx', ...(cacheTags || [])],
    },
  )

  const code = cacheKey ? await compileCached() : await compileUncached()

  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  return <MDXContent components={{ ...comps, ...components }} />
}

const baseComponents: MDXComponents = {
  img: (props) => (
    <Suspense fallback={<div />}>
      <Img {...props} />
    </Suspense>
  ),
  code: Code,
  video: Video,
  a: Anchor,
  del: Del,
  pre: (props) => <>{props.children}</>,
  'timomeh-oembed': ClientSideOembed,
  blockquote: (props) => {
    if (props.className?.includes('oembed')) {
      return <blockquote {...props} />
    }

    return <Blockquote {...props} />
  },
  Footnote: () => null,
  FootnoteContent,
  FootnoteReference,
  FootnotesSection,
  ReadMore: () => null,
  Kbd,
  Lead,
  Figure,
  Aside,
  DefinitionList,
  Definition,
}

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}

const plainComponents: MDXComponents = {
  ReadMore: () => null,
  FootnoteContent: () => null,
  FootnoteReference: () => null,
  FootnotesSection: () => null,
  Kbd,
  Lead: (props) => <>{props.children}</>,
  Figure,
  DefinitionList,
  Definition,
  'timomeh-oembed': (props) => <div {...props} />,
  Aside: ({ children, title }) => {
    return (
      <aside>
        <h4>{title}</h4>
        {children}
      </aside>
    )
  },
  img: (props) => {
    if (props.src.includes('darkmode-')) {
      return null
    }

    const src = imgproxyLoader({ src: props.src, width: 680, quality: 80 })

    // biome-ignore lint/a11y/useAltText: props passed through
    // biome-ignore lint/performance/noImgElement: plain image in feed
    return <img {...props} src={src} />
  },
  Footnote: (props) => <span>&nbsp;[Footnote: {props.children}]</span>,
}

function handleHTML(html: string, info: TransformerInfo) {
  const { url, transformer } = info
  if (
    transformer.name === '@remark-embedder/transformer-oembed' &&
    url.includes('youtube.com')
  ) {
    const noCookieHtml = html.replace('youtube.com', 'youtube-nocookie.com')
    return `<div className="not-prose oembed my-5 oembed-youtube aspect-video rounded-lg overflow-hidden in-data-[landmark=content-page]:md:-mx-4">${noCookieHtml}</div>`
  }

  if (transformer.name === '@remark-embedder/transformer-oembed') {
    html = html.replace(
      '<blockquote class="',
      '<blockquote data-theme="light" data-align="center" class="oembed ',
    )
    return `<div className="not-prose max-w-full min-w-0 oembed my-5 in-data-[landmark=content-page]:md:-mx-4"><timomeh-oembed>${html}</timomeh-oembed></div>`
  }

  return html
}
