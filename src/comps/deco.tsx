import { decoImage, randomDecoIndex, randomDecoPosition } from '../lib/random'

function Deco({ img }: { img: string }) {
  let marginTop = 0
  if (img.startsWith('xmas')) marginTop = 8
  if (img.startsWith('fir')) marginTop = 4
  if (img.startsWith('newyears')) marginTop = 14

  return (
    <div
      style={{ backgroundImage: `url(/assets/deco/${img})`, marginTop }}
      className="dark:brightness-90 pointer-events-none brightness-110 opacity-90 absolute h-[40px] w-[98px] -top-7 z-[2] bg-contain bg-no-repeat"
    />
  )
}

export function RandomDeco({ seed }: { seed: string }) {
  const index = randomDecoIndex(seed)
  const image = decoImage()

  return <Deco img={`${image}-${index}.png`} />
}

export function RandomAppearDeco({ seed }: { seed: string }) {
  const left = randomDecoPosition(seed)
  if (!left) return null

  return (
    <div style={{ marginLeft: left }}>
      <RandomDeco seed={seed} />
    </div>
  )
}
