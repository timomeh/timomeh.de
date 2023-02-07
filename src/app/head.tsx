import { CommonHead } from '@/components/CommonHead'
import { Seo } from '@/components/Seo'

export default function Head() {
  return (
    <>
      <CommonHead />
      <Seo
        defaultTitle="Timo Mämecke"
        description="Hi, I’m Timo Mämecke, Software Engineer from Germany, and this is the place where I write stuff."
      />
    </>
  )
}
