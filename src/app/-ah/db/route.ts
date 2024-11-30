import { db } from '@/data/db'

export async function GET() {
  await db.connect()
  const pong = await db.redis.ping()

  return new Response(pong)
}
