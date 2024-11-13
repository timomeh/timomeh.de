export default async function NotFound() {
  return (
    <div className="mx-auto mt-10 max-w-2xl px-4">
      <div className="prose prose-invert">
        <h1 className="effect-crt-blue font-pixel text-4xl font-bold leading-none">
          ERR 404
        </h1>
        <p>Sorry, this tag does not seem to exist!</p>
      </div>
    </div>
  )
}
