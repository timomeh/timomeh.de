export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV !== 'development'
  ) {
    const { createConsoleMethod, log } = await import('./lib/log')

    console.error = createConsoleMethod(log, 'error')
    console.log = createConsoleMethod(log, 'info')
    console.info = createConsoleMethod(log, 'info')
    console.warn = createConsoleMethod(log, 'warn')
    console.debug = createConsoleMethod(log, 'debug')
  }
}
