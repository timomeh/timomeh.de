import { getPlaiceholder } from 'plaiceholder'

export class ImageRepo {
  static async generatePlaceholder(imgSrc: string) {
    const image = await fetch(imgSrc, { cache: 'no-store' })
    const buffer = Buffer.from(await image.arrayBuffer())

    const result = await getPlaiceholder(buffer, { size: 10 })

    return result
  }
}
