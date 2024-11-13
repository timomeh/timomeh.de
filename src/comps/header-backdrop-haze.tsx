export function HeaderBackdropHaze() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex items-center
        overflow-x-clip sm:justify-center"
    >
      <div
        className="absolute -ml-[40%] mt-40 h-[400px] w-[600px] rotate-6 transform
          bg-gradient-radial from-purple-300 opacity-15 mix-blend-difference sm:ml-0"
      />
    </div>
  )
}
