export function metaTitle(content: string, { author = 'Timo', max = 60 } = {}) {
  const prefix = `${author}: “`
  const suffix = `”`
  const text = content.replace(/\s+/g, ' ').trim()

  const available = max - (prefix.length + suffix.length)
  if (available <= 0) return `${author} thinks…`
  if (text.length <= available) return `${prefix}${text}${suffix}`

  const ellipsis = '…'
  const cutoff = Math.max(0, available - ellipsis.length)
  let slice = text.slice(0, cutoff)
  const lastSpace = slice.lastIndexOf(' ')
  if (lastSpace > 0) slice = slice.slice(0, lastSpace)
  slice = slice.trim()

  return `${prefix}${slice}${ellipsis}${suffix}`
}
