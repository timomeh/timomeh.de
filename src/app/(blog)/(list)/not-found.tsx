import { Prose } from '@/comps/prose'

export default async function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <Prose crtTitle>
        <h1>ERR 404</h1>
        <p>Sorry, this page does not seem to exist!</p>
      </Prose>
    </div>
  )
}
