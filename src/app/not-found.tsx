import { ReportBrokenLink } from '@/comps/report-broken-link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="prose prose-invert">
        <h1 className="effect-crt-blue font-pixel text-4xl font-bold leading-none">
          ERR 404
        </h1>
        <p>
          Sorry, you either found a broken link, or clicked an old link. If you
          clicked on a link and arrived here, that’s my fault. Feel free to{' '}
          <ReportBrokenLink />.
        </p>
      </div>
    </div>
  )
}
