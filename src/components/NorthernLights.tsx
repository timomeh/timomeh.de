import { GreenAurora, VioletAurora } from './Aurora'

export function NorthernLights() {
  return (
    <div className="meh-fulltop z-[-1] relative">
      <div className="w-full h-80 left-0 right-0 absolute flex justify-center overflow-y-hidden">
        <div className="absolute -top-24 -mr-[300px]">
          <VioletAurora />
        </div>
        <div className="absolute -ml-[280px] -top-32">
          <GreenAurora />
        </div>
      </div>
    </div>
  )
}
