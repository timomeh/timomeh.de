import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import parse, { Element, domToReact } from 'html-react-parser'

import { getBlogPost } from '../../../lib/blog'
import { GithubLogo } from '../../../components/GithubLogo'
import { PostTitle } from '../../../components/PostTitle'
import { Prose } from '../../../components/Prose'
import { PostComments } from './PostComments'

type Props = {
  params: {
    slug: string
  }
}

export default async function Post({ params }: Props) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return notFound()
  }

  return (
    <>
      <Prose>
        <h1 className="!mb-0">
          <PostTitle title={post.title} />
        </h1>
        <div className="flex items-center space-x-2">
          <div className="text-slate-500 text-sm">
            posted on {post.postedAt}
          </div>
          <a
            href={`https://github.com/timomeh/timomeh.de/discussions/${post.discussionNumber}`}
            rel="noopener noreferrer"
            target="_blank"
            className="fill-slate-500 hover:fill-slate-700 transition-colors"
          >
            <GithubLogo className="w-[26px] h-[26px] -m-1 p-1" />
          </a>
        </div>
        <div className="h-6 md:h-8" />

        {parse(post.body, {
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
                  href={domNode.attribs['href'].replace(
                    'https://timomeh.de',
                    ''
                  )}
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
      </Prose>
      <hr className="h-px bg-slate-200 mt-12 md:mt-20 mb-12" />

      <PostComments discussionNumber={post.discussionNumber} />
    </>
  )
}
