import readingTime from 'reading-time'

export function formatReadingTime(
  content: string,
  override?: string | null,
  suffix: string = '',
) {
  if (override && isNumeric(override)) {
    return `${override} min ${suffix}`.trim()
  }

  if (override) {
    return override
  }

  const { minutes } = readingTime(content)
  return `${Math.round(minutes) || 1} min ${suffix}`.trim()
}

function isNumeric(str: string) {
  return !isNaN(+str) && !isNaN(parseFloat(str))
}
