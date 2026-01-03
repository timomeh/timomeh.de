import { type NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'
import { kernel } from '@/data/kernel'
import { NukeCaches } from '../data'

// yeet everything that's in the cache and re-cache it.

export async function GET(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.searchParams.get('secret') !== config.api.nukeSecret
  ) {
    return NextResponse.json({ message: 'Unverified' }, { status: 401 })
  }

  const soft = request.nextUrl.searchParams.get('soft')
  return NukeCaches.withKernel(kernel.scoped()).invoke({ soft: Boolean(soft) })
}
