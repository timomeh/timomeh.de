import { torchlight, Block } from '@torchlight-api/torchlight-cli'

torchlight.init({
  token: process.env.TORCHLIGHT_TOKEN,
  theme: 'moonlight-ii',
})

type Highlight = {
  lang: string
  code: string
}

export async function highlight({ lang, code }: Highlight) {
  const block = new Block({
    language: lang,
    code,
  })

  const results = await torchlight.highlight([block])

  const result = results?.[0]

  if (!result) {
    return {
      code,
      style: {},
    }
  }

  // remove colorful text shadows
  // the theme is nice and my most favorite, but the shadows are too much
  const highlighted = results[0]?.highlighted.replace(
    /text-shadow: 0 0 \d+px #[0-9A-Fa-f]+.*?black;/gm,
    ''
  )

  return {
    code: highlighted,
    style: toStyleObject(result.styles || '') || undefined,
  }
}

// taken from: https://stackoverflow.com/a/68853314
function toStyleObject(string: string) {
  if (!string) return {}

  const css_json = `{"${string
    .replace(/; /g, '", "')
    .replace(/: /g, '": "')
    .replace(';', '')}"}`

  const obj = JSON.parse(css_json)

  const keyValues = Object.keys(obj).map((key) => {
    var camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase())
    return { [camelCased]: obj[key] }
  })
  return Object.assign({}, ...keyValues)
}
