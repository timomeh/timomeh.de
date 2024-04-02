import { PostTag } from '@/comps/post-tag'
import { Tag } from '@/comps/tag'
import { TagLink } from '@/comps/tag-link'
import { listTags } from '@/lib/blog'

export async function PostTags() {
  const tags = await listTags()

  return (
    <div className="flex flex-wrap gap-2">
      <TagLink href="/" dim>
        <Tag color="rgb(156, 163, 175)" name="Everything" />
      </TagLink>
      {tags.map((tag) => (
        <TagLink key={tag} href={`/tag/${tag}`} dim>
          <PostTag slug={tag} />
        </TagLink>
      ))}
    </div>
  )
}
