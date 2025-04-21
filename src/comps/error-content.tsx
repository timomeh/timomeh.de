import { Prose } from './prose'
import { ReportBrokenPage } from './report-broken-link'

type Props = {
  reset?: () => void
  description?: React.ReactNode
}

export function ErrorContent({ reset, description }: Props) {
  return (
    <Prose>
      <h1>Server Error</h1>
      {description || <p>Sorry, something went wrong.</p>}
      <p>
        This isn’t your fault, it’s mine. But not all hope is lost—you can try
        the following steps:
      </p>
      <ol>
        {reset && (
          <li>
            <a role="button" onClick={() => reset()}>
              try to load this page again
            </a>
          </li>
        )}
        <li>come back later</li>
        <li>
          <ReportBrokenPage />
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=1SIIQKeIVRg&list=PLhNfpsFRdENmOmuPoWFhYDB7E-Ex2Hpk-">
            watch some important videos
          </a>
        </li>
      </ol>
    </Prose>
  )
}
