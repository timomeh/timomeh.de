'use client'

import '@/styles/main.css'

import Link from 'next/link'

import { ErrorContent } from '@/comps/error-content'
import { Footer } from '@/comps/footer'
import { Mug } from '@/comps/me/mug'
import { ThemeSwitchScript } from '@/comps/theme-switch-script'

type Props = {
  error: Error & { digest?: string }
}

export default function GlobalError({ error: _error }: Props) {
  return (
    <html
      lang="en"
      data-theme="system"
      className="group/root bg-grainy-light dark:bg-grainy h-full bg-[#f2f1f0]
        bg-[length:200px_200px] text-gray-900 scheme-light transition-colors
        dark:bg-[#141314] dark:text-white dark:scheme-dark"
    >
      <head>
        <ThemeSwitchScript />
      </head>
      <body className="group/body relative">
        <div className="relative flex min-h-dvh flex-col self-start *:w-full">
          <div
            className="group/header mx-auto flex max-w-2xl flex-row items-center justify-start px-4
              py-10 sm:items-end sm:justify-end"
          >
            <div
              className="relative z-30 flex max-h-20 max-w-20 shrink items-center justify-center
                sm:max-h-24 sm:max-w-24"
            >
              <div className="relative">
                <Link
                  title="Go to home"
                  href="/"
                  className="group/link relative block size-full rotate-0 transition-transform ease-in-out
                    select-none motion-safe:hover:scale-110 motion-safe:hover:-rotate-3
                    motion-safe:active:scale-105 motion-safe:active:-rotate-2"
                >
                  <Mug />
                </Link>
              </div>
            </div>
          </div>
          <main className="relative z-30 w-full flex-1">
            <div className="mx-auto max-w-2xl px-4">
              <ErrorContent />
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
