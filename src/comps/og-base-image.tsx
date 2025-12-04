/** biome-ignore-all lint/performance/noImgElement: og image */

import { unstable_noStore } from 'next/cache'
import type { ImageResponseOptions } from 'next/server'

import { config } from '@/config'

const basePath = config.siteUrl

type Props = {
  cover?: string
  title: string[]
  date?: Date | string
  est?: string
}

export function OpengraphBaseImage({ cover, title, date, est }: Props) {
  unstable_noStore()

  return (
    <div
      tw="flex w-full h-full"
      style={{ fontFamily: '"Outfit"', background: '#0D0E12' }}
    >
      {!cover && (
        <img
          tw="absolute inset-0"
          src={`${basePath}/assets/og-dark-bg.png`}
          width="1200"
          height="630"
          alt=""
        />
      )}
      {cover && (
        <>
          <img
            tw="absolute inset-0 opacity-30"
            src={cover}
            width="1200"
            height="630"
            alt=""
            style={{ objectFit: 'cover' }}
          />
          <img
            tw="absolute inset-0"
            src={`${basePath}/assets/og-dark-overlay.png`}
            width="1200"
            height="630"
            alt=""
          />
        </>
      )}
      <div tw="absolute z-10 flex flex-col inset-0">
        <div tw="flex-shrink-0" style={{ height: 220 }} />
        <div tw="relative flex flex-col justify-center px-16 flex-1">
          <div
            tw="text-3xl flex font-medium mb-4"
            style={{
              fontFamily: '"Pixeloid"',
              textShadow: '0 0 5px rgba(0,0,0,0.8), 0 0 20px black',
            }}
          >
            {!!date && (
              <div tw="text-purple-300">
                {new Date(date).toLocaleString('en-US', {
                  dateStyle: 'medium',
                })}
              </div>
            )}
            {!!date && !!est && (
              <div tw="text-white opacity-70 ml-3">{`| ${est}`}</div>
            )}
          </div>
          <div tw="flex flex-col relative">
            {false && <div tw="absolute -inset-4 bg-black opacity-50" />}
            <div
              tw="text-6xl text-violet-100 font-bold flex flex-col"
              style={{ textShadow: '0 5px 20px black' }}
            >
              {title.map((t, i) => (
                <div key={i}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getFonts() {
  const [outbold, outmed, pix] = await Promise.all([
    fetch(`${basePath}/assets/OutfitBold.woff`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`${basePath}/assets/OutfitMedium.woff`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`${basePath}/assets/Pixeloid.woff`).then((res) => res.arrayBuffer()),
  ])

  return {
    fonts: [
      {
        name: 'Outfit',
        data: outbold,
        style: 'normal',
        weight: 700,
      },
      {
        name: 'Outfit',
        data: outmed,
        style: 'normal',
        weight: 500,
      },
      {
        name: 'Pixeloid',
        data: pix,
        style: 'normal',
        weight: 500,
      },
    ],
  } satisfies ImageResponseOptions
}
