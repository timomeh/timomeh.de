import { PostTag } from '@/comps/post-tag'
import { Tag } from '@/comps/tag'
import { TagLink } from '@/comps/tag-link'
import { listTags } from '@/data/tags'

type Props = {
  scope?: string
}

export async function PostTags({ scope }: Props) {
  const tags = await listTags()

  return (
    <div className="flex flex-wrap gap-2">
      <TagLink href={scope || '/'} dim>
        <Tag color="rgb(156, 163, 175)" title="Everything" />
      </TagLink>
      {tags.map((tag) => (
        <TagLink key={tag.slug} href={`${scope || ''}/tag/${tag.slug}`} dim>
          <PostTag slug={tag.slug} />
        </TagLink>
      ))}
    </div>
  )
}
