import { GreenAurora, VioletAurora } from './Aurora'

export function NorthernLights() {
  return (
    <div className="meh-fulltop z-[-1] relative flex justify-center">
      <div className="absolute -top-24 -mr-[300px]">
        <VioletAurora />
      </div>
      <div className="absolute -ml-[280px] -top-32">
        <GreenAurora />
      </div>
    </div>
  )
}
