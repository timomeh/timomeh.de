import { Prose } from '@/components/Prose'
import { redirect } from 'next/navigation'

export default async function Home() {
  redirect('/offtopic')

  return (
    <main className="meh-main">
      <div className="mx-4">
        <Prose>
          <p>Redirecting...</p>
        </Prose>
      </div>
    </main>
  )
}
