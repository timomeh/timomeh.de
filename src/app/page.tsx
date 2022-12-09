import Link from 'next/link'
import { Prose } from '../components/Prose'

export default function Home() {
  return (
    <Prose>
      <h1>Hi 👋</h1>
      <p>
        I’m Timo Mämecke, online sometimes known as{' '}
        <a href="https://mastodon.social/@timomeh" rel="noopener noreferrer">
          @timomeh
        </a>
        . I am a Software Engineer from Germany, and Frontend Engineering Lead
        at{' '}
        <a href="https://gigs.com" rel="noopener noreferrer">
          Gigs
        </a>
        .
      </p>
      <p>
        You can read my <Link href="/posts">Posts</Link> about code and other
        random things I felt like writing about.
      </p>
      <p>
        I have a past of building Blogs and wanting to publish content, but
        barely writing anything.{' '}
        <Link href="/posts/how-to-build-a-blog/">I found the issue</Link> and{' '}
        <Link href="/posts/how-i-built-this-blog/">implemented a fix</Link>.
      </p>
      <p>
        If you want to reach out to me, you can do so via{' '}
        <a href="https://mastodon.social/@timomeh" rel="noopener noreferrer">
          Mastodon
        </a>
        ,{' '}
        <a
          href="https://github.com/timomeh/timomeh.de/discussions/new?category=ask-me"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{' '}
        or <a href="mailto:hello@timomeh.de">Email</a>.
      </p>
      <p>
        You should also check out{' '}
        <a href="https://christianpoplawski.de/" rel="noopener noreferrer">
          Chris’
        </a>{' '}
        and{' '}
        <a href="https://losstopschade.de/" rel="noopener noreferrer">
          Daniel’s
        </a>{' '}
        stuff.
      </p>
    </Prose>
  )
}
