export async function sleep(ms = 0): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export function getEnv(item: string): string {
  const val = process.env[item]
  if (!val) {
    console.error(`${item} undefined`)
    throw `${item} undefined`
  }

  return val
}
