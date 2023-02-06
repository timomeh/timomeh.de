import { Prose } from '@/components/Prose'

export default function NotFound() {
  return (
    <main className="meh-main">
      <div className="mx-4">
        <Prose>
          <h1>Not found :(</h1>
          <p>
            Sorry, you either found a broken link, or clicked an old link. If
            you think I did something wrong, feel free to reach out.
          </p>
        </Prose>
      </div>
    </main>
  )
}
