import { Payload } from 'payload'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

type Cached = {
  client: Payload | null
  promise: Promise<Payload> | null
}
let cached: Cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

export async function initPayload() {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayloadHMR({ config: configPromise })
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
