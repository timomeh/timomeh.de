import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import { Anchor } from './anchor'
import { Blockquote } from './blockquote'
import { Code } from './code'
import { Del } from './del'
import { Heading } from './heading'
import { Img } from './img'
import { mdxOptions } from './mdx-options'
import { Section } from './section'
import { Video } from './video'

type Props = {
  content: string
  inline?: boolean
}

type MDXComponents = MDXRemoteProps['components']

export function MDX({ content, inline }: Props) {
  return (
    <MDXRemote
      source={content}
      components={{
        ...components,
        ...(inline && inlineComponents),
      }}
      options={{ mdxOptions }}
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
  h1: (props) => <Heading element="h1" {...props} />,
  h2: (props) => <Heading element="h2" {...props} />,
  h3: (props) => <Heading element="h3" {...props} />,
  h4: (props) => <Heading element="h4" {...props} />,
  h5: (props) => <Heading element="h5" {...props} />,
  h6: (props) => <Heading element="h6" {...props} />,
  section: Section,
  blockquote: Blockquote,
}

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}
