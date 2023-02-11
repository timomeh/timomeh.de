import { CommonHead } from '@/components/CommonHead'
import { Feeds } from '@/components/Feeds'
import { Seo } from '@/components/Seo'

// This file wouldn't be necessary if rewrites would be working:
// https://github.com/vercel/next.js/issues/40549

export default function Head() {
  return (
    <>
      <CommonHead />
      <Feeds type="offtopic" />
      <Seo
        description="I think things and just write 'em down."
        canonical="https://timomeh.de/"
      />
    </>
  )
}
