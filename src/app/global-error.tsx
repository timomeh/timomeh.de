'use client'

import '@/styles/main.css'

import Link from 'next/link'

import { Mug } from '@/comps/me/mug'

import { ErrorContent } from '../comps/error-content'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html data-theme="system" className="page-bg text-gray-900 dark:text-white">
      <body>
        <div className="flex min-h-dvh flex-col items-center justify-center p-6">
          <div className="relative size-18 sm:size-24" data-force-shocked-mug>
            <Link
              aria-label="Go to home"
              href="/"
              className="group/link relative block size-full transition-transform ease-in-out select-none
                motion-safe:hover:scale-110 motion-safe:hover:-rotate-1
                motion-safe:active:scale-105"
            >
              <Mug />
            </Link>
          </div>
          <div className="mt-8 w-[500px] max-w-full">
            <ErrorContent
              reset={reset}
              description={
                <p>
                  Sorry, something went wrong while trying to load the site.{' '}
                  <code>digest:{error.digest || 'none'}</code>
                </p>
              }
            />
          </div>
        </div>
      </body>
    </html>
  )
}
