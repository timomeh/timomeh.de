import { ReportBrokenPage } from './report-broken-link'

type Props = {
  reset: () => void
  description?: React.ReactNode
}

export function ErrorContent({ reset, description }: Props) {
  return (
    <div className="prose prose-invert">
      <h1 className="effect-crt-blue font-pixel text-4xl font-bold leading-none">
        ERR 500
      </h1>
      {description || (
        <p>
          Whoopsie daisy, something went terribly wrong. Not all hope is lost,
          you can try the following steps:
        </p>
      )}
      <ol>
        <li>
          <a role="button" onClick={() => reset()}>
            try to load this page again
          </a>
        </li>
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
    </div>
  )
}
