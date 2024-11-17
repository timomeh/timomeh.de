import { db } from '@/data/db'

export async function GET() {
  await db.connect()
  await db.redis.ping()

  return new Response('OK')
}
