// remove all null and undefined from an object, recursively
// biome-ignore lint/suspicious/noExplicitAny: sry
export function cleanse<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [
        k,
        typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)
          ? cleanse(v)
          : v,
      ]),
  ) as T
}
