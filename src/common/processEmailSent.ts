import { EmailSentByDay } from './types'

export const emailSentByDay = new Map()

// Add to emails sent map
export function incEmailSentByDay(sent: Date): void {
  const day = sent.toISOString().slice(0, 10)
  emailSentByDay.set(
    day,
    emailSentByDay.has(day) ? emailSentByDay.get(day) + 1 : 1
  )
}

// Process list for email sent and store in db.
export async function processEmailSentByDay(
  insertEmailSentByDay: (words: Array<EmailSentByDay>) => void,
  log?: (msg: string) => void
): Promise<void> {
  const email: EmailSentByDay[] = []
  emailSentByDay.forEach((value, key) =>
    email.push({ sent: key, total: value })
  )
  email.sort((a, b) => new Date(a.sent).getTime() - new Date(b.sent).getTime())
  if (log) log('processEmailSentByDay: ' + email.length + ' records')
  await insertEmailSentByDay(email)
}
