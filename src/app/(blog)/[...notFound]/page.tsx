// Because I have multiple root layouts, i have to suppress that it tries
// to render app/not-found.tsx

import { notFound } from 'next/navigation'

export default function NotFound() {
  notFound()
}
