export function parseSort(param: string | string[] | undefined) {
  return param?.toString() === 'asc' ? 'ASC' : 'DESC'
}
