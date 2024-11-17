// return random array item
export function sample<T extends any>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
