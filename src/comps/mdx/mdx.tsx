import remarkEmbedder, { TransformerInfo } from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'

import { remarkImageSrcPrefix } from '@/lib/remarkImagePrefix'
import { withMdxFootnotes } from '@/lib/remarkMdxFootnotes'
import { remarkReadMore } from '@/lib/remarkReadMore'

import { Anchor } from './anchor'
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

type Props = {
  content: string
  assetPrefix?: string
  inline?: boolean
  plain?: boolean
  readMorePath?: string
  scope?: string
  components?: MDXComponents
}

type MDXComponents = MDXRemoteProps['components']

export function MDX({
  content,
  inline,
  assetPrefix,
  plain,
  readMorePath,
  scope,
  components = {},
}: Props) {
  const comps = plain
    ? plainComponents
    : {
        ...baseComponents,
        ...({
          FootnoteContent: (props) => (
            <FootnoteContent {...props} scope={scope} />
          ),
          FootnoteReference: (props) => (
            <FootnoteReference {...props} scope={scope} />
          ),
          FootnotesSection: (props) => (
            <FootnotesSection {...props} scope={scope} />
          ),
        } as MDXComponents),
        ...(!!readMorePath &&
          ({
            ReadMore: () => <ReadMore href={readMorePath} />,
          } as MDXComponents)),
        ...(inline && inlineComponents),
      }

  return (
    <MDXRemote
      source={content}
      components={{ ...comps, ...components }}
      options={{
        mdxOptions: {
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
              remarkEmbedder,
              {
                transformers: [oembedTransformer],
                handleHTML,
              },
            ],
            !plain ? withMdxFootnotes : () => {},
            remarkSmartypants,
            readMorePath ? remarkReadMore : () => {},
          ],
        },
      }}
    />
  )
}

const baseComponents: MDXComponents = {
  img: Img,
  code: Code,
  video: Video,
  a: Anchor,
  del: Del,
  pre: (props) => <>{props.children}</>,
  blockquote: Blockquote,
  Footnote: () => null,
  FootnoteContent,
  FootnoteReference,
  FootnotesSection,
  ReadMore: () => null,
  Kbd,
  Lead,
  Figure,
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
  Footnote: (props) => <span>&nbsp;[Footnote: {props.children}]</span>,
}

function handleHTML(html: string, info: TransformerInfo) {
  const { url, transformer } = info
  if (
    transformer.name === '@remark-embedder/transformer-oembed' ||
    url.includes('youtube.com')
  ) {
    const noCookieHtml = html.replace('youtube.com', 'youtube-nocookie.com')
    return `<div className="oembed my-5 oembed-youtube aspect-video rounded-lg overflow-hidden md:-mx-4">${noCookieHtml}</div>`
  }
  return html
}
