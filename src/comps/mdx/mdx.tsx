import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkEmbedder, { TransformerInfo } from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'

import { Anchor } from './anchor'
import { Blockquote } from './blockquote'
import { Code } from './code'
import { Del } from './del'
import { Img } from './img'
import { Video } from './video'
import { withMdxFootnotes } from '@/lib/remarkMdxFootnotes'
import {
  FootnoteContent,
  FootnoteReference,
  FootnotesSection,
} from './footnote'
import { remarkImageSrcPrefix } from '@/lib/remarkImagePrefix'
import { remarkReadMore } from '@/lib/remarkReadMore'
import { ReadMore } from './read-more'

type Props = {
  content: string
  assetPrefix?: string
  inline?: boolean
  plain?: boolean
  readMorePath?: string
  scope?: string
}

type MDXComponents = MDXRemoteProps['components']

export function MDX({
  content,
  inline,
  assetPrefix,
  plain,
  readMorePath,
  scope,
}: Props) {
  const comps = plain
    ? plainComponents
    : {
        ...components,
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
      components={comps}
      options={{
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkUnwrapImages,
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
            withMdxFootnotes,
            readMorePath ? remarkReadMore : () => {},
          ],
        },
      }}
    />
  )
}

const components: MDXComponents = {
  img: Img,
  code: Code,
  video: Video,
  a: Anchor,
  del: Del,
  pre: (props) => <>{props.children}</>,
  blockquote: Blockquote,
  FootnoteContent,
  FootnoteReference,
  FootnotesSection,
  ReadMore: () => null,
}

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}

const plainComponents: MDXComponents = {
  ReadMore: () => null,
  FootnoteContent: () => null,
  FootnoteReference: () => null,
  FootnotesSection: () => null,
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
