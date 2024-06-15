export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initPayload } = await import('./payload/client')
    await initPayload()
  }
}
