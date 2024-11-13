import { initRedis } from './data/db'

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'edge') {
    const { initRedis } = await import('./data/db')
    await initRedis()
  }
}
