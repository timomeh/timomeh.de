import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { Prose } from '../components/Prose'

export default function NotFound() {
  return (
    <Layout>
      <Head>
        <title>Not Found :( | Timo Mämecke</title>
      </Head>
      <Prose>
        <h1>Not found :(</h1>
        <p>
          Sorry, you either found a broken link, or clicked an old link. If you
          think I did something wrong, feel free to reach out.
        </p>
      </Prose>
    </Layout>
  )
}
