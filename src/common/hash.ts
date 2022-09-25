// Create hash to dedupe.
export const hashMap = new Map()

export function hash(s: string): number {
  let h = 0,
    i: number,
    chr: number
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i)
    h = (h << 5) - h + chr
    h |= 0 // Convert to 32bit integer
  }
  return h
}
