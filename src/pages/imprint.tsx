import { Layout } from '../components/Layout'
import { Prose } from '../components/Prose'

export default function Imprint() {
  return (
    <Layout>
      <h1 className="font-display font-bold text-3xl hidden">Timo</h1>
      <Prose>
        <h1>Imprint</h1>

        <p>
          Timo Mämecke
          <br />
          Karl-Korn-Straße 18
          <br />
          50678 Köln
          <br />
          Deutschland – Germany
        </p>

        <h2>Contact</h2>
        <p>
          E-Mail: <a href="mailto:kontakt@maemecke.com">kontakt@maemecke.com</a>
        </p>
      </Prose>
    </Layout>
  )
}
