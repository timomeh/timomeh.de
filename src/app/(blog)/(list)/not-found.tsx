import { Prose } from '@/comps/prose'

export default async function NotFound() {
  return (
    <div className="relative">
      <div className="p-4 sm:p-6 md:p-8">
        <Prose>
          <h1>Page not found</h1>
          <p>Sorry, this page does not seem to exist.</p>
        </Prose>
      </div>
    </div>
  )
}
