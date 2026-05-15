'use client'

import { useRouter } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

export function SearchDialog({ children }: Props) {
  const router = useRouter()

  return (
    <dialog
      ref={(el) => {
        // make the dialog be in modal mode for a11y and styling
        el?.showModal()
      }}
      closedby="any"
      className="
        page-bg z-[100] mx-auto mt-8 flex
        max-h-[calc(100dvh-2rem-16px)] w-[calc(100%-32px)] max-w-xl flex-col p-0 pb-0 text-current
        shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm
        md:mt-[10vh] md:max-h-[calc(100dvh-10vh-16px)]
      "
      onClose={() => {
        router.back()
      }}
    >
      {children}
    </dialog>
  )
}
