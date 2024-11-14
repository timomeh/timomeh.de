export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initRedis } = await import('./data/db')
    await initRedis()
  }
}
