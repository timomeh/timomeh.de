'use client'

import { CircleXIcon, MenuIcon } from 'lucide-react'

type Props = {
  children: React.ReactNode
}

export function ResponsiveSidebar({ children }: Props) {
  return (
    <>
      <div className="fixed top-2 right-2 z-50 sm:hidden">
        <button
          type="button"
          aria-label="Open Menu"
          className="flex items-center justify-center rounded-lg border border-gray-900/40
            bg-[#FDFDFD]/60 shadow-md/20 backdrop-blur-sm hover:shadow-md/50
            active:translate-y-px dark:border-white/20 dark:bg-[#191A22]/80"
          onClick={() => {
            const $dialog = document.getElementById(
              'mobile-sidebar',
            ) as HTMLDialogElement
            $dialog.showModal()
          }}
        >
          <div className="jusitfy-center flex items-center gap-1.5 p-2">
            <MenuIcon className="size-4" />
            <div className="font-mono text-xs leading-none font-semibold">
              Menu
            </div>
          </div>
        </button>
      </div>
      <dialog
        id="mobile-sidebar"
        ref={($dialog) => {
          if (!$dialog) return

          const handleClick = (e: MouseEvent) => {
            // if ((e.target as HTMLElement | null)?.closest('a')) {
            //   $dialog.close()
            //   return
            // }

            const rect = $dialog.getBoundingClientRect()
            const isBackdrop =
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            if (isBackdrop) $dialog.close()
          }
          $dialog.addEventListener('click', handleClick)

          return () => {
            $dialog.removeEventListener('click', handleClick)
          }
        }}
        className="m-auto scale-90 overflow-visible bg-transparent opacity-0 transition-all
          backdrop:bg-white/50 backdrop:opacity-0 backdrop:backdrop-blur-xs
          backdrop:transition-all open:scale-100 open:opacity-100
          open:backdrop:opacity-100 sm:block sm:[all:unset] dark:backdrop:bg-gray-950/40
          starting:open:scale-90 starting:open:opacity-0 starting:open:backdrop:opacity-0"
      >
        <div className="-mt-10 mb-1 flex justify-end sm:hidden">
          <button
            aria-label="Close"
            autoFocus
            className="-mx-2 p-2 text-gray-800 dark:text-gray-100"
            onClick={() => {
              const $dialog = document.getElementById(
                'mobile-sidebar',
              ) as HTMLDialogElement
              $dialog.close()
            }}
          >
            <CircleXIcon className="size-6 drop-shadow-md drop-shadow-white/60 dark:drop-shadow-black/60" />
          </button>
        </div>
        {children}
      </dialog>
    </>
  )
}
