import * as React from 'react'
import { postFilePaths, serializeMdx, readPostSync } from '@/lib/mdxUtils'

type HomeProps = PageProps<typeof getStaticProps>

export default function Home(_props: HomeProps) {
  return (
    <div />
  )
}

export const getStaticProps = async () => {
  const rawPosts = postFilePaths.map(readPostSync)
  const posts = await Promise.all(rawPosts.map(async (rawPost) => ({
    ...rawPost,
    excerpt: rawPost.excerpt
      ? await serializeMdx(rawPost.excerpt, rawPost.frontMatter)
      : undefined
  }))) // yo i heard you like brackets

  return { props: { posts } }
}