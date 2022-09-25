import { dbName, searchHistoryCollection, SearchHistoryEntry } from './common'
import { Pool } from 'pg'

export async function getSearchHistory(): Promise<Array<SearchHistoryEntry>> {
  const pool = new Pool({ database: dbName })
  const result = await pool.query(
    `select * from ${searchHistoryCollection} order by time_stamp desc`
  )
  return result.rows.map((entry) => ({
    id: entry.history_id,
    timestamp: entry.time_stamp,
    entry: entry.entry,
  }))
}

export async function clearSearchHistory(): Promise<string> {
  const pool = new Pool({ database: dbName })
  await pool.query(`truncate table ${searchHistoryCollection}`)
  return `Search history cleared`
}
