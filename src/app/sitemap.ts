import { GenerateSitemap } from '@/data/actions/generateSitemap'
import { kernel } from '../data/kernel'

export default async function sitemap() {
  return GenerateSitemap.withKernel(kernel.scoped()).invoke()
}
