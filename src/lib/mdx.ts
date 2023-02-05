export function getChapters(markdown: string) {
  const heading = /(?<flag>#{2})\s+(?<content>.+)/g

  const matches = Array.from(markdown.matchAll(heading))
  return matches
    .map(({ groups }) => groups?.content)
    .filter((content): content is string => !!content)
}
