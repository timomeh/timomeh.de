import sindreSlugify from '@sindresorhus/slugify'

export function slugify(str: string) {
  return sindreSlugify(str)
}
