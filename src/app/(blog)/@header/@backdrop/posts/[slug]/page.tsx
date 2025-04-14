import { HeaderBackdropEmpty } from '@/comps/header-backdrop-empty'
import { HeaderBackdropImage } from '@/comps/header-backdrop-image'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)

  if (post?.frontmatter.cover) {
    return (
      <HeaderBackdropImage
        src={contentAsset('posts', post.slug, post.frontmatter.cover)}
      />
    )
  }

  return <HeaderBackdropEmpty />
}
