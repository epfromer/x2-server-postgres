export interface Email {
  id: string
  sent: Date
  sentShort: string
  from: string
  fromCustodian: string
  to: string
  toCustodians: string[]
  cc: string
  bcc: string
  subject: string
  body: string
}

export interface EmailTotal {
  emails: Array<Email>
  total: number
}

export interface EmailSentByDay {
  sent: Date | string
  total: number
}

export interface CustodianInteractions {
  custodianId: string
  total: number
}

export interface Custodian {
  id: string
  name: string
  aliases: string[]
  title: string
  color: string
  senderTotal: number
  receiverTotal: number
  toCustodians: CustodianInteractions[]
}

export interface WordCloudTag {
  tag: string
  weight: number
}

export interface HTTPQuery {
  id?: string
  skip?: number
  limit?: number
  sort?: string
  order?: number
  sent?: string
  allText?: string
  from?: string
  to?: string
  subject?: string
  body?: string
  loc?: string
  color?: string
}

export interface ImportLogEntry {
  id: string
  timestamp: string
  entry: string
}

export interface SearchHistoryEntry {
  id: string
  timestamp: string
  entry: string
}
