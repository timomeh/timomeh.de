'use client'

import { LoaderCircle } from 'lucide-react'
import Form from 'next/form'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

type Props = {
  defaultValue: string
}

export function SearchInput({ defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue)
  const ownUpdate = useRef(false)
  const handleSearch = useDebouncedCallback((form: HTMLFormElement) => {
    form.requestSubmit()
  }, 200)

  useEffect(() => {
    // trickery to prevent hiccups while typing when query param changes
    if (!ownUpdate.current) {
      setValue(defaultValue)
    }
    ownUpdate.current = false
  }, [defaultValue])

  return (
    <Form action="" replace={true} className="relative">
      <input
        // oxlint-disable-next-line jsx_a11y/no-autofocus: it's the only action here
        autoFocus
        name="query"
        value={value}
        placeholder="Search a post..."
        className="mb-4 w-full font-serif text-lg font-semibold md:text-xl"
        onChange={(e) => {
          ownUpdate.current = true
          setValue(e.target.value)

          if (e.target.form) {
            handleSearch(e.target.form)
          }
        }}
      />
      <div className="absolute top-1.5 right-1">
        <LoadingState />
      </div>
    </Form>
  )
}

function LoadingState() {
  const status = useFormStatus()

  if (!status.pending) return null

  return <LoaderCircle aria-busy className="size-4 animate-spin text-current" />
}

function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )
}
