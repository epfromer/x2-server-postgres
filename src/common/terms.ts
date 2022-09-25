import { PSTMessage } from 'pst-extractor'

// https://books.google.com/books?id=CeapJz_amLUC&pg=SL1-PA25&lpg=SL1-PA25&dq=enron+glossary&source=bl&ots=ZIvVX780A0&sig=ACfU3U1As4CgzXi4THiPraSuiTeh_vVpjg&hl=en&sa=X&ved=2ahUKEwiVypmsga_pAhWHsJ4KHXCbDfcQ6AEwCHoECAoQAQ#v=onepage&q=enron%20glossary&f=false

export const keyTerms = [
  'Avici',
  'Azurix',
  'Backbone',
  'Braveheart',
  'Catalytica',
  'Cortez',
  'Cuiaba',
  'Fishtail',
  'Merlin',
  'Osprey',
  'Rawhide',
  'Southampton',
  'TNPC',
  'Yosemite',
  'apache',
  'bammel',
  'bobcat',
  'campsie',
  'cayman',
  'chewco',
  'condor',
  'deathstar',
  'ebs',
  'fraud',
  'granite',
  'grizzly',
  'harrier',
  'herron',
  'jedi',
  'ljm',
  'ljm1',
  'ljm2',
  'mahonia',
  'porcupine',
  'preservation',
  'pronghorn',
  'raptor',
  'raptors',
  'ricochet',
  'roadrunner',
  'shutdown',
  'sidewinder',
  'snohomish',
  'stanley',
  'steele',
  'swap',
  'talon',
  'tammy',
  'teresa',
  'timberwolf',
  'tonya',
  'trutta',
  'valhalla',
  'valor',
  'velocity',
  'whitewing',
]

const keyNames = [
  'baxter',
  'belden',
  'causey',
  'dasovich',
  'fastow',
  'fleming',
  'frevert',
  'glisan',
  'kitchen',
  'kopper',
  'lavorato',
  'lay',
  'mcmahon',
  'skilling',
  'symes',
  'watkins',
  'whalley',
]

export function hasTerms(email: PSTMessage): boolean {
  for (const term of keyTerms) {
    if (email.body.indexOf(term) >= 0 || email.subject.indexOf(term) >= 0)
      return true
  }
  for (const term of keyNames) {
    if (
      email.body.indexOf(term) >= 0 ||
      email.subject.indexOf(term) >= 0 ||
      email.senderName.indexOf(term) >= 0 ||
      email.senderEmailAddress.indexOf(term) >= 0 ||
      email.displayTo.indexOf(term) >= 0 ||
      email.displayBCC.indexOf(term) >= 0 ||
      email.displayCC.indexOf(term) >= 0
    )
      return true
  }
  return false
}
