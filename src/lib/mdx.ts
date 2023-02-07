export function getChapters(markdown: string) {
  const heading = /^##\s+(?<content>.+)/gm

  const matches = Array.from(markdown.matchAll(heading))
  return matches
    .map(({ groups }) => groups?.content)
    .filter((content): content is string => !!content)
}
