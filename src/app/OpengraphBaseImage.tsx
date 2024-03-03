/* eslint-disable @next/next/no-img-element */

import { ImageResponseOptions } from 'next/server'

type Props = {
  cover?: string
  title: string[]
  date?: Date | string
}

export function OpengraphBaseImage({ cover, title, date }: Props) {
  return (
    <div tw="flex w-full h-full" style={{ fontFamily: '"Outfit"' }}>
      {!cover && (
        <img
          tw="absolute inset-0"
          src="https://timomeh.de/assets/og-dark-template.png"
          width="1200"
          height="630"
          alt=""
        />
      )}
      {cover && (
        <>
          <img
            tw="absolute inset-0"
            src={cover}
            width="1200"
            height="630"
            alt=""
            style={{ objectFit: 'cover' }}
          />
          <img
            tw="absolute inset-0"
            src="https://timomeh.de/assets/og-dark-template-overlay.png"
            width="1200"
            height="630"
            alt=""
          />
        </>
      )}
      <div tw="absolute inset-16 z-10 flex flex-col justify-end">
        <div tw="flex flex-col relative">
          <div tw="absolute -inset-4 bg-black opacity-50" />
          <div tw="text-6xl text-violet-100 font-bold flex flex-col">
            {title.map((t, i) => (
              <div key={i}>{t}</div>
            ))}
          </div>
          <div tw="text-3xl flex mt-8 text-violet-100 font-medium opacity-50">
            <div tw="mr-2">timomeh.de</div>
            {!!date && (
              <>
                <div tw="mr-2">•</div>
                <div>
                  {new Date(date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getFonts() {
  const [fbold, fmed] = await Promise.all([
    fetch('https://timomeh.de/assets/OutfitBold.woff').then((res) =>
      res.arrayBuffer(),
    ),
    fetch('https://timomeh.de/assets/OutfitMedium.woff').then((res) =>
      res.arrayBuffer(),
    ),
  ])

  return {
    fonts: [
      {
        name: 'Outfit',
        data: fbold,
        style: 'normal',
        weight: 700,
      },
      {
        name: 'Outfit',
        data: fmed,
        style: 'normal',
        weight: 500,
      },
    ],
  } satisfies ImageResponseOptions
}
