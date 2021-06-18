import * as React from 'react'
import { GetStaticPaths, GetStaticPropsContext } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { getSlugs, readPostSync, serializeMdx } from '@/lib/mdxUtils'

type PostProps = PageProps<typeof getStaticProps>

export default function Post(props: PostProps) {
  return (
    <div>
      <MDXRemote {...props.source} components={{}} />
    </div>
  )
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ slug: string }>) => {
  const slug = ctx.params!.slug
  const { content, frontMatter } = readPostSync(slug)
  const source = await serializeMdx(content, frontMatter)

  return {
    props: { source, frontMatter }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSlugs().map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}