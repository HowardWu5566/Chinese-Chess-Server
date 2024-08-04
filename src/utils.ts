export function generateId(
  prefix: string,
  checkingRange: Map<string, any>
): string {
  let id: string
  do {
    id = prefix + (Math.floor(Math.random() * 9000) + 1000)
  } while (checkingRange?.has(id))
  return id
}
