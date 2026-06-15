export function invariant(
  condition: unknown,
  message = 'Invariant failed',
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
