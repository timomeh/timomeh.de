// return an array as a range of numbers
// be gone, lodash
export function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx)
}
