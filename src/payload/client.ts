import { env } from '@/env'
import payload, { Payload } from 'payload'
import { InitOptions } from 'payload/config'

type Cached = {
  client: Payload | null
  promise: Promise<Payload> | null
}
let cached: Cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

type Opts = {
  initOptions?: Partial<InitOptions>
}

export async function initPayload({ initOptions }: Opts = {}) {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      secret: env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}

export const cms = cached.client as Payload
