import Randoma from 'randoma'

export function randomDecoPosition(seed: string) {
  const random = new Randoma({ seed })
  const appear = random.boolean()

  if (appear) {
    const left = random.integerInRange(0, 30)
    return left
  }

  return null
}

export function randomDecoIndex(seed: string) {
  const random = new Randoma({ seed })
  const index = random.integerInRange(0, 4)
  return index
}

export function decoImage() {
  const unix = Date.now()
  const fir = 1763175600000
  const snow = 1765681200000
  const christmas = 1766199600000
  const snowagain = 1766977200000
  const newyears = 1767063600000
  const moresnow = 1767409200000

  if (unix > moresnow) return 'snow'
  if (unix > newyears) return 'newyears'
  if (unix > snowagain) return 'snow'
  if (unix > christmas) return 'xmas'
  if (unix > snow) return 'snow'
  if (unix > fir) return 'fir'
  return 'leaves'
}
