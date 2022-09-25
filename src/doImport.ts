import { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'
import {
  Custodian,
  custodianCollection,
  dbName,
  Email,
  emailCollection,
  EmailSentByDay,
  emailSentByDayCollection,
  getNumPSTs,
  processCustodians,
  processEmailSentByDay,
  processWordCloud,
  searchHistoryCollection,
  walkFSfolder,
  wordCloudCollection,
  WordCloudTag,
} from './common'

const processSend = (msg: string) => {
  if (!process || !process.send) {
    console.error('no process object or process.end undefined')
    return
  }
  process.send(msg)
}

async function run() {
  if (!getNumPSTs(process.argv[2])) {
    processSend(`no PSTs found in ${process.argv[2]}`)
    return
  }

  processSend(`connect to ${process.env.PGHOST}`)
  let pool = new Pool()

  const insertEmails = async (emails: Email[]) => {
    const q = `insert into ${emailCollection} (
      email_id, 
      email_sent, 
      email_from, 
      email_from_lc, 
      email_from_custodian, 
      email_from_custodian_lc, 
      email_to, 
      email_to_lc, 
      email_to_custodians, 
      email_to_custodians_lc, 
      email_cc, 
      email_cc_lc, 
      email_bcc, 
      email_bcc_lc, 
      email_subject, 
      email_subject_lc, 
      email_body, 
      email_body_lc) 
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`
    emails.forEach(async (email) => {
      await pool.query(q, [
        uuidv4(), // email_id
        email.sent, // email_sent
        email.from, // email_from
        email.from.toLowerCase(), // email_from_lc
        email.fromCustodian, // email_from_custodian
        email.fromCustodian.toLowerCase(), // email_from_custodian_lc
        email.to, // email_to
        email.to.toLowerCase(), // email_to_lc
        email.toCustodians.toString(), // email_to_custodians
        email.toCustodians.toString().toLowerCase(), // email_to_custodians_lc
        email.cc, // email_cc
        email.cc.toLowerCase(), // email_cc_lc
        email.bcc, // email_bcc
        email.bcc.toLowerCase(), // email_bcc_lc
        email.subject, // email_subject
        email.subject.toLowerCase(), // email_subject_lc
        email.body, // email_body
        email.body.toLowerCase(), // email_body_lc
      ])
    })
  }

  const insertWordCloud = async (wordCloud: WordCloudTag[]) => {
    const q = `insert into ${wordCloudCollection} (tag, weight) values ($1, $2)`
    wordCloud.forEach(async (word) => {
      await pool.query(q, [word.tag, word.weight])
    })
  }

  const insertEmailSentByDay = async (emailSentByDay: EmailSentByDay[]) => {
    const q = `insert into ${emailSentByDayCollection} (day_sent, total) values ($1, $2)`
    emailSentByDay.forEach(async (day) => {
      await pool.query(q, [day.sent, day.total])
    })
  }

  const insertCustodians = async (custodians: Custodian[]) => {
    const q = `insert into ${custodianCollection} (custodian_id, custodian_name, title, color, sender_total, receiver_total, to_custodians) values ($1, $2, $3, $4, $5, $6, $7)`
    custodians.forEach(async (custodian) => {
      await pool.query(q, [
        custodian.id,
        custodian.name,
        custodian.title,
        custodian.color,
        custodian.senderTotal,
        custodian.receiverTotal,
        JSON.stringify(custodian.toCustodians),
      ])
    })
  }

  processSend(`drop database`)
  try {
    await pool.query(`revoke connect on database ${dbName} from public`)
    await pool.query(
      `select pg_terminate_backend(pg_stat_activity.pid) from pg_stat_activity where pg_stat_activity.datname = '${dbName}'`
    )
  } catch (err) {
    console.error(err)
  }
  try {
    await pool.query('drop database if exists ' + dbName)
  } catch (err) {
    console.error(err)
  }

  processSend(`create database`)
  await pool.query('create database ' + dbName)

  pool = new Pool({ database: dbName })
  await pool.query(
    `create table ${emailCollection} (email_id varchar(255), email_sent timestamptz, email_from text, email_from_lc text, email_from_custodian text, email_from_custodian_lc text, email_to text, email_to_lc text, email_to_custodians text, email_to_custodians_lc text, email_cc text, email_cc_lc text, email_bcc text, email_bcc_lc text, email_subject text, email_subject_lc text, email_body text, email_body_lc text)`
  )
  await pool.query(
    `alter table ${emailCollection} add constraint email_pkey primary key (email_id)`
  )
  await pool.query(
    `create table ${wordCloudCollection} (tag varchar(255), weight integer)`
  )
  await pool.query(
    `alter table ${wordCloudCollection} add constraint wordcloud_pkey primary key (tag)`
  )
  await pool.query(
    `create table ${emailSentByDayCollection} (day_sent timestamptz, total integer)`
  )
  await pool.query(
    `alter table ${emailSentByDayCollection} add constraint emailsentbyday_pkey primary key (day_sent)`
  )
  await pool.query(
    `create table ${custodianCollection} (custodian_id varchar(255), custodian_name text, title text, color text, sender_total integer, receiver_total integer, to_custodians text)`
  )
  await pool.query(
    `alter table ${custodianCollection} add constraint custodians_pkey primary key (custodian_id)`
  )
  await pool.query(
    `create table ${searchHistoryCollection} (history_id varchar(255), time_stamp varchar(25), entry varchar(255))`
  )
  await pool.query(
    `alter table ${searchHistoryCollection} add constraint history_id_pkey primary key (history_id)`
  )

  processSend(`process emails`)
  const numEmails = await walkFSfolder(process.argv[2], insertEmails, (msg) =>
    processSend(msg)
  )

  processSend(`process word cloud`)
  await processWordCloud(insertWordCloud, (msg) => processSend(msg))

  processSend(`process email sent`)
  await processEmailSentByDay(insertEmailSentByDay, (msg) => processSend(msg))

  processSend(`process custodians`)
  await processCustodians(insertCustodians, (msg) => processSend(msg))

  processSend(`completed ${numEmails} emails in ${process.argv[2]}`)
}

run().catch((err) => console.error(err))
