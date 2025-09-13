// return random array item
export function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
