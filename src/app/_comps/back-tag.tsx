import { Tag } from './tag'
import { TagLink } from './tag-link'

export function BackTag() {
  return (
    <TagLink href="/">
      <Tag color="#DEC1EF" name="← Back" />
    </TagLink>
  )
}
