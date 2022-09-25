export async function sleep(ms = 0): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
