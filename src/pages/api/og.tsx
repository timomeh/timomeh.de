/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import removeMd from 'remove-markdown'

export const config = {
  runtime: 'experimental-edge',
}

const fbold = fetch(new URL('@/styles/Outfit-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
)
const fmed = fetch(new URL('@/styles/Outfit-Medium.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
)

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    if (!searchParams.has('slug')) {
      return new Response('No slug', { status: 404 })
    }
    const slug = searchParams.get('slug')!
    const category = searchParams.get('category')! as 'posts' | 'offtopic'

    // @ts-expect-error
    process.version = 'v420.69'

    const { getDiscussion } = await import('@/lib/github')
    const entry = await getDiscussion({ slug, category })

    if (!entry) {
      return new Response(`No ${category} with the requested slug`, {
        status: 404,
      })
    }

    let title = /^# (.*$)/gim.exec(entry.body)?.[1].trim()
    title ||= /^title: (.*$)/gim.exec(entry.body)?.[1].trim()
    title ||= entry.body.split(' ').slice(0, 10).join(' ').concat('…')
    title ||= entry.title

    const fontDataBold = await fbold
    const fontDataMedium = await fmed

    return new ImageResponse(
      (
        <div tw="flex w-full h-full" style={{ fontFamily: '"Outfit"' }}>
          <img
            tw="absolute inset-0"
            src="https://timomeh.de/og-dark-template.png"
            width="1200"
            height="630"
            alt=""
          />
          <div tw="absolute inset-16 z-10 flex flex-col justify-end">
            <div tw="w-[80%] flex flex-col">
              <div tw="text-6xl text-violet-100 font-bold">
                {removeMd(title)}
              </div>
              <div tw="text-3xl flex mt-8 text-violet-100 font-medium opacity-50">
                <div tw="mr-2">timomeh.de</div>
                <div tw="mr-2">•</div>
                <div>
                  {new Date(entry.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Outfit',
            data: fontDataBold,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Outfit',
            data: fontDataMedium,
            style: 'normal',
            weight: 500,
          },
        ],
      }
    )
  } catch (error: any) {
    console.log(error.message)

    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
