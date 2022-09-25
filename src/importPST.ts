import cp from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import { HTTPQuery, ImportLogEntry } from './common'

const log: Array<ImportLogEntry> = []
let importing = false

export function importPST(httpQuery: HTTPQuery): string {
  if (!httpQuery.loc) return 'No import location specified'
  if (importing) return `Import from ${httpQuery.loc} in progress`
  log.length = 0 // truncate log
  importing = true

  // fork long duration processing task
  console.log('forking import process')
  const importer = cp.fork('./src/doImport.ts', [httpQuery.loc], {
    execArgv: ['-r', 'ts-node/register'],
  })
  importer.on('message', (msg) =>
    log.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      entry: 'postgres: ' + msg,
    })
  )
  importer.on('close', () => {
    console.log('import process exit')
    importing = false
  })
  return `Started import from ${httpQuery.loc}`
}

export function getImportStatus(): Array<ImportLogEntry> {
  return log
}
