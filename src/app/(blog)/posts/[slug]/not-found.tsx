import { Prose } from '@/comps/prose'

export default function NotFound() {
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <Prose crtTitle>
        <h1>ERR 404</h1>
        <p>Sorry, this post does not seem to exist!</p>
      </Prose>
    </div>
  )
}
