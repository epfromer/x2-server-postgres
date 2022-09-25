import { PSTMessage } from 'pst-extractor'
import * as sw from 'stopword'
import { keyTerms } from './terms'
import { WordCloudTag } from './types'

// TODO investigate https://www.npmjs.com/package/natural

const wordCloudMap = new Map()
keyTerms.forEach((term) => wordCloudMap.set(term.toLowerCase(), 0))

// Tokenize body for word cloud
export function addToWordCloud(
  email: PSTMessage,
  fromCustodian: string,
  toCustodians: string
): void {
  // remove EDRM sig
  const zlSig = '***********'
  let cleanBody = email.body.slice(0, email.body.indexOf(zlSig))

  // add in other fields to body
  cleanBody += ' ' + email.senderName
  cleanBody += ' ' + fromCustodian
  cleanBody += ' ' + email.displayTo
  cleanBody += ' ' + toCustodians
  cleanBody += ' ' + email.displayCC
  cleanBody += ' ' + email.displayBCC
  cleanBody += ' ' + email.subject

  // remove CR/LF and lowercase
  cleanBody = cleanBody.replace(/[\r\n\t]/g, ' ').toLowerCase()

  // remove stopwords (common words that don't affect meaning)
  let cleanArr = cleanBody.split(' ')
  cleanArr = sw.removeStopwords(cleanArr)

  // bump counts for any term in our key terms
  cleanArr.forEach((term) => {
    if (wordCloudMap.has(term)) {
      wordCloudMap.set(term, wordCloudMap.get(term) + 1)
    }
  })
}

// Process list for word cloud and store in db.
export async function processWordCloud(
  insertWordCloud: (words: Array<WordCloudTag>) => void,
  log?: (msg: string) => void
): Promise<void> {
  const words: WordCloudTag[] = []
  wordCloudMap.forEach((v, k) => {
    words.push({ tag: k, weight: v })
  })
  if (log) log('processWordCloud: ' + words.length + ' terms')
  await insertWordCloud(words)
}
