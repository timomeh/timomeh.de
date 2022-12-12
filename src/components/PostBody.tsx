import Image from 'next/image'
import Link from 'next/link'
import parse, { Element, domToReact } from 'html-react-parser'
import { markdownToHtml } from '../lib/markdown'

type Props = {
  body: string
}

export async function PostBody({ body }: Props) {
  const parsedBody = await markdownToHtml(body)

  return (
    <>
      {parse(parsedBody, {
        replace: (domNode) => {
          if (
            domNode instanceof Element &&
            domNode.name === 'img' &&
            domNode.attribs['src'].startsWith(
              'https://user-images.githubusercontent.com/4227520/'
            )
          ) {
            return (
              <Image
                src={domNode.attribs['src']}
                alt={domNode.attribs['alt']}
                width={+domNode.attribs['width']}
                height={+domNode.attribs['height']}
                quality={100}
                sizes="(min-width: 672px) 640px, 100vw"
              />
            )
          }

          if (
            domNode instanceof Element &&
            domNode.name === 'a' &&
            domNode.attribs['href']?.startsWith('https://timomeh.de/')
          ) {
            return (
              <Link
                href={domNode.attribs['href'].replace('https://timomeh.de', '')}
              >
                {domToReact(domNode.children)}
              </Link>
            )
          }

          if (domNode instanceof Element && domNode.name === 'pre') {
            return (
              <pre className={`not-prose ${domNode.attribs['class']}`}>
                {domToReact(domNode.children)}
              </pre>
            )
          }
        },
      })}
    </>
  )
}
