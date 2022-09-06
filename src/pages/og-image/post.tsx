/* eslint-disable @next/next/no-img-element */

import React from 'react'
import { useRouter } from 'next/router'
import { Logo } from '../../components/Logo'

export default function OgImagePost() {
  const router = useRouter()
  const title = router.query.title?.toString()

  return (
    <div className="w-[1200px] h-[630px] relative">
      <img
        className="absolute inset-0"
        src="/og-background.png"
        width="1200"
        height="630"
        alt=""
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="absolute top-8 left-8">
          <Logo className="w-20 h-auto fill-slate-900/20" />
        </div>
        <div className="w-[80%] flex flex-col items-center">
          <div className="font-display text-7xl font-bold text-center text-slate-900">
            {title}
          </div>
          <div className="min-h-[8px] flex-shrink h-10" />
          <div className="flex-shink-0 h-px bg-slate-800/10 w-[400px]" />
          <div className="min-h-[8px] flex-shrink h-10" />
          <div className="flex">
            <img
              src="/avatar.png"
              width="400"
              height="400"
              className="rounded-full w-24 h-24"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}
