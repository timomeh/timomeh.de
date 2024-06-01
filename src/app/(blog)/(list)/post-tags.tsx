import { PostTag } from '@/app/_comps/post-tag'
import { Tag } from '@/app/_comps/tag'
import { TagLink } from '@/app/_comps/tag-link'
import { listCategories } from '@/app/_data/category.dto'

export async function PostTags() {
  const categories = await listCategories()

  return (
    <div className="flex flex-wrap gap-2">
      <TagLink href="/" dim>
        <Tag color="rgb(156, 163, 175)" name="Everything" />
      </TagLink>
      {categories.map((category) => (
        <TagLink key={category.id} href={`/tag/${category.slug}`} dim>
          <PostTag slug={category.slug} />
        </TagLink>
      ))}
    </div>
  )
}
