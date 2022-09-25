import { custodians } from './custodians'
import { Custodian } from './types'

// Fast map of from/to: #
const custodialInteractions = new Map()

export function addCustodiansInteraction(
  fromCustodian: string,
  toCustodians: string[]
): void {
  // console.log(fromCustodian, toCustodians)

  toCustodians.forEach((toCustodian) => {
    const key = fromCustodian + '/' + toCustodian
    custodialInteractions.set(
      key,
      custodialInteractions.has(key) ? custodialInteractions.get(key) + 1 : 1
    )
  })
}

// add to totals for Custodians
export function incSenderTotal(fromCustodian: string): void {
  const custodian = custodians.find((c) => c.id === fromCustodian)
  if (custodian) custodian.senderTotal++
}
export function incReceiverTotal(toCustodian: string): void {
  const custodian = custodians.find((c) => c.id === toCustodian)
  if (custodian) custodian.receiverTotal++
}

// Process list for Custodians and store in db.
export async function processCustodians(
  insertCustodians: (words: Array<Custodian>) => void,
  log?: (msg: string) => void
): Promise<void> {
  if (log) log('processCustodians: ' + custodians.length + ' Custodians')

  // console.log(custodialInteractions)

  // split apart fast map into individual custodians
  custodialInteractions.forEach((value, key) => {
    const peeps = key.split('/')
    const custodian = custodians.find((c) => c.id === peeps[0])
    if (custodian) {
      custodian.toCustodians.push({ custodianId: peeps[1], total: value })
    }
  })

  await insertCustodians(custodians)
}
