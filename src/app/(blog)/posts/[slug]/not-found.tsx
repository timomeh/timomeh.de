export default async function NotFound() {
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <div className="prose prose-invert">
        <h1 className="effect-crt-blue font-pixel text-4xl font-bold leading-none">
          ERR 404
        </h1>
        <p>Sorry, this post does not seem to exist!</p>
      </div>
    </div>
  )
}
