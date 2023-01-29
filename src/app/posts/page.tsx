import { Prose } from '@/components/Prose'
import { listOfftopics } from '@/lib/blog'
import { compileMDX } from 'next-mdx-remote/rsc'

export const revalidate = false

export default async function Posts() {
  const offtopics = await listOfftopics()

  const { content } = await compileMDX({
    source: offtopics[0].body,
    components: {
      h1: (props) => <h1 {...props} className="text-2xl font-bold" />,
      h2: (props) => <h2 {...props} className="text-xl font-bold" />,
      SanityCheck: () => <div className="w-10 h-10 bg-red-400" />,
      MoreSanityCheck: ({ foo }) => (
        <div className="w-10 h-10 bg-green-400">{foo}</div>
      ),
    },
    compiledSource: '',
  })

  return (
    <>
      <Prose>
        <h1>Posts</h1>
        <p>
          About software development and other thoughts I wanted to elaborate
          on.
        </p>

        <div className="h-6" />
        <div>{content}</div>
      </Prose>
    </>
  )
}
