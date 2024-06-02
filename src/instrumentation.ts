export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize payload in the child process,
    // so we can import `cms` without awaiting it
    const { initPayload } = await import('./payload/client')
    await initPayload()
  }

  // screw edge
}
