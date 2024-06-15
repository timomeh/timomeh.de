import { SocialBox } from './social-box'

export function HeaderBackdropHaze() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-10 h-0">
        <div className="relative mx-auto max-w-2xl px-4">
          <SocialBox />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-start
          overflow-x-clip sm:justify-center"
      >
        <div
          className="absolute -ml-[40%] h-[400px] w-[600px] rotate-6 transform bg-gradient-radial
            from-purple-300 opacity-15 mix-blend-difference sm:ml-0"
        />
      </div>
    </>
  )
}
