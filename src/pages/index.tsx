import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { Prose } from '../components/Prose'

export default function Home() {
  return (
    <Layout>
      <Head>
        <meta
          name="description"
          content="Hi, I’m Timo Mämecke, Software Engineer from Germany, and this is the place where I write stuff."
          key="description"
        />
      </Head>
      <Prose>
        <h1>Hi 👋</h1>
        <p>
          I’m Timo Mämecke, online sometimes known as{' '}
          <a href="https://twitter.com/timomeh" rel="noopener noreferrer">
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
          If you want to reach out to me, you can do so via{' '}
          <a href="https://twitter.com/timomeh" rel="noopener noreferrer">
            Twitter
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
    </Layout>
  )
}
