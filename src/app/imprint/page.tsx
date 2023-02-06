import { Prose } from '../../components/Prose'

export default function Imprint() {
  return (
    <main className="meh-main">
      <div className="mx-4">
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
            E-Mail: <a href="mailto:hello@timomeh.de">hello@timomeh.de</a>
          </p>
        </Prose>
      </div>
    </main>
  )
}
