/** biome-ignore-all lint/style/noNonNullAssertion: envs */
/** biome-ignore-all lint/style/useTemplate: just a script bro */

import fs from 'node:fs'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import OpenAI, { toFile } from 'openai'

const internalBlogUrl = process.env.INTERNAL_URL || 'http://localhost:3000'
const debug = false
const openai = new OpenAI()
const Bucket = process.env.AWS_S3_BUCKET_NAME!
const s3client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION!,
  endpoint: process.env.AWS_ENDPOINT_URL!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function doIt() {
  const historicWeather = await getHistoricWeather()
  const historicConditions = historicWeather.split('\n')
  console.log(historicConditions.slice(-20).join('\n'))

  // aim for a new image every 6 hours.
  // we always want to generate an image for the middle of this timerange.
  const now = new Date()
  const simulatedDate = new Date(now.setHours(now.getHours() + 3))

  const weatherRes = await openai.responses.create({
    model: 'gpt-5-mini',
    reasoning: { effort: 'low' },
    instructions: `You write a weather simulation for a ficticious city in an urban area, with a central european climate.
You are given a date and previous weather conditions and simulate the next condition by first writing temperature, wind and conditions and then a single additional short sentence which describes the weather more detailed with max 1 additional subordinate clause. No line breaks.
You generate your response based on the previous weather conditions to simulate a weather progression.
You simulate weather realistically and stereotyped for the season, mixed with sometimes more extreme weather events typical for the season.
You only respond with the simulated conditions in the form of sentences, do not include the date.
Around a specific holiday, it's always the most beautiful weather for the season.
Do not repeat the same descriptions.
Do not repeat the same conditions multiple times after another.`,
    input: `Date: ${simulatedDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })}
Previous conditions: ${historicConditions.slice(-12).join('\n')}`,
  })
  const simulation = weatherRes.output_text
  const weatherReport =
    simulatedDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }) +
    ': ' +
    simulation
  console.log(weatherReport)

  const imagePromptRes = await openai.responses.create({
    model: 'gpt-5-mini',
    reasoning: { effort: 'low' },
    instructions: `You create prompts for image generation.
You are given a date and the weather, which you use to depict a specific scene.
The scene is in an urban area.
You describe it very moody: sometimes happy scenes, sometimes more melancholic.
Your reponse MUST NOT include the temperature in degrees, just a description of the temperature and weather conditions.
Your reponse MUST NOT include the specific date, but must include the daytime and ambiente.
Around a specific holiday, make it cheerful and add details typical for the holiday.
Add seasonal and daytime specific elements, such as:
- fairy lights at night
- halloween decorations during halloween season
- trees with yellow and golden leaves in autumn
- leaves flying around or lying on the ground
- storms or rain depending on the weather
- bare trees in winter
- or anything else you can think of

Focus on one specific scene or setting, do not mix multiple small scenes.

You use the following template to create the prompt:
INSERT HERE THE SUBJECT AND SETTING
art style: high-quality fine pixel art, 64x64 style, detailed shading, soft gradients, smooth color transitions, professional indie game aesthetic, balanced palette, retro yet modern pixel art look`,
    input: weatherReport,
  })

  console.log(imagePromptRes.output_text)

  console.log('Generating dark image...')
  const unsafeDarkImageRes = await openai.images.generate({
    model: 'gpt-image-1',
    output_format: 'webp',
    size: '1536x1024',
    quality: 'auto',
    prompt: imagePromptRes.output_text,
  })

  if (!unsafeDarkImageRes?.data?.[0]?.b64_json) {
    console.log(unsafeDarkImageRes)
    throw new Error('Unsafe dark image response did not include expected data')
  }

  const unsafeDarkImageBase64 = unsafeDarkImageRes.data[0].b64_json

  // telling it to add vignette in the first image generation doesn't produce great results.
  // it's much more reliable to do a second path to add the vignette.
  console.log('Edit dark image to add vignette...')
  const darkImageRes = await openai.images.edit({
    model: 'gpt-image-1',
    output_format: 'webp',
    size: '1536x1024',
    quality: 'auto',
    image: [
      await toFile(Buffer.from(unsafeDarkImageBase64, 'base64'), null, {
        type: 'image/webp',
      }),
    ],
    prompt: `Perform a zoom out on this image so all borders naturally fade to full black.
The image must fade at all border to pure black with a oval vignette, with all four sides of the scene naturally fading and blending into a dark black background.
If the image is bright, darken it just a bit.
keep the art style: high-quality fine pixel art, 64x64 style, detailed shading, soft gradients, smooth color transitions, professional indie game aesthetic, balanced palette, retro yet modern pixel art look`,
  })

  if (!darkImageRes?.data?.[0]?.b64_json) {
    console.log(darkImageRes)
    throw new Error('Dark image response did not include expected data')
  }

  const darkImageBase64 = darkImageRes.data[0].b64_json

  if (debug) {
    fs.writeFileSync('dark.png', Buffer.from(darkImageBase64, 'base64'))
  }

  console.log('Generating light image...')
  const lightImageRes = await openai.images.edit({
    model: 'gpt-image-1',
    output_format: 'webp',
    size: '1536x1024',
    quality: 'auto',
    image: [
      await toFile(Buffer.from(darkImageBase64, 'base64'), null, {
        type: 'image/webp',
      }),
    ],
    prompt: `Change this image to be bright. The image must fade at all border to pure white with a oval vignette, with all four sides of the scene naturally fading and blending into a bright white background.
keep the art style: high-quality fine pixel art, 64x64 style, detailed shading, soft gradients, smooth color transitions, professional indie game aesthetic, balanced palette, retro yet modern pixel art look.
the image depicts: ${imagePromptRes.output_text}`,
  })

  if (!lightImageRes?.data?.[0]?.b64_json) {
    console.log(lightImageRes)
    throw new Error('Light image response did not include expected data')
  }

  const darkFileName = simulatedDate.getTime() + '_dark.webp'
  const lightFileName = simulatedDate.getTime() + '_light.webp'
  const originalFileName = simulatedDate.getTime() + '_orig.webp'

  const lightImageBase64 = lightImageRes.data[0].b64_json

  await storePrompt(
    simulatedDate.getTime().toString(),
    weatherReport + '\n\n' + imagePromptRes.output_text,
  )

  console.log('Uploading images to bucket...')
  await Promise.all([
    s3client.send(
      new PutObjectCommand({
        Bucket,
        Key: `seasons/dark/${darkFileName}`,
        Body: Buffer.from(darkImageBase64, 'base64'),
        ContentType: 'image/webp',
      }),
    ),
    s3client.send(
      new PutObjectCommand({
        Bucket,
        Key: `seasons/light/${lightFileName}`,
        Body: Buffer.from(lightImageBase64, 'base64'),
        ContentType: 'image/webp',
      }),
    ),
    s3client.send(
      new PutObjectCommand({
        Bucket,
        Key: `season_originals/${originalFileName}`,
        Body: Buffer.from(unsafeDarkImageBase64, 'base64'),
        ContentType: 'image/webp',
      }),
    ),
  ])

  console.log('Uploaded files:', {
    darkFileName,
    lightFileName,
  })

  console.log('Update weather history...')
  await updateHistoricWeather(historicWeather, weatherReport)

  if (debug) {
    fs.writeFileSync('light.png', Buffer.from(lightImageBase64, 'base64'))
  }

  console.log('Force cache revalidation...')
  await fetch(
    `${internalBlogUrl}/webhooks/revalidate?tag=season-images&secret=${process.env.NUKE_SECRET}`,
  )

  console.log('Done.')
}

async function getHistoricWeather() {
  const res = await s3client
    .send(new GetObjectCommand({ Bucket, Key: 'historic_weather.txt' }))
    .catch((e) => {
      if (e.Code === 'NoSuchKey') return { Body: null }
      throw e
    })

  if (!res.Body) {
    return ''
  }

  const string = await res.Body.transformToString()
  return string
}

async function updateHistoricWeather(
  previousEntries: string,
  newEntry: string,
) {
  const Body = previousEntries + '\n' + newEntry.replace(/[\r\n]+/g, '')
  const BodyWithoutBlankLines = Body.replace(/^\s*[\r\n]/gm, '')
  await s3client.send(
    new PutObjectCommand({
      Bucket,
      Key: 'historic_weather.txt',
      Body: BodyWithoutBlankLines,
      ContentType: 'text/plain; charset=utf-8',
    }),
  )
}

async function storePrompt(id: string, prompt: string) {
  await s3client.send(
    new PutObjectCommand({
      Bucket,
      Key: `season_prompts/${id}.txt`,
      Body: prompt,
      ContentType: 'text/plain; charset=utf-8',
    }),
  )
}

async function main() {
  await doIt()
}

main().then(() => {
  process.exit(0)
})
