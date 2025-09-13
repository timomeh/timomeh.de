export function saneParseInt(value: string) {
  const num = parseInt(value, 10)
  return !Number.isNaN(num) && Number.isInteger(num) && value === num.toString()
    ? num
    : null
}
