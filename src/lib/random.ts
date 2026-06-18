export function shuffle<T>(array: T[], seed?: number) {
  const newArray = [...array]
  const random = seed !== undefined ? mulberry32(seed) : Math.random

  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }

  return newArray
}

// return random array item
export function sample<T>(array: T[], seed?: number): T {
  const random = seed !== undefined ? mulberry32(seed) : Math.random

  return array[Math.floor(random() * array.length)]
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
