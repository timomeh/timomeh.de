import Link from 'next/link'
import { Layout } from '../components/Layout'
import { Prose } from '../components/Prose'

export default function Home() {
  return (
    <Layout>
      <Prose>
        <h1>Hi 👋</h1>
        <p>
          I’m Timo Mämecke, online sometimes known as{' '}
          <a href="https://gigs.com" rel="noopener noreferrer">
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
          You can read my{' '}
          <Link href="/posts">
            <a>Posts</a>
          </Link>{' '}
          about code and other random things I felt like writing about.
        </p>
        <p>
          I have a past of building Blogs and wanting to publish content, but
          barely writing anything.{' '}
          <Link href="/posts/how-to-build-a-blog/">
            <a>I found the issue</a>
          </Link>{' '}
          and{' '}
          <Link href="/posts/how-i-built-this-blog/">
            <a>implemented a fix</a>
          </Link>
          .
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
    </Layout>
  )
}
