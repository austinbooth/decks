import { openDB } from "idb"
import { IDBSession } from '@/types'

export const DBNAME = 'decks'
export const USER_STORE_NAME = 'user'
export const SWIPING_SESSIONS_STORE_NAME = 'sessions'

export const writeUserToidb = async(uid: string) => {
  const db = await openDB(DBNAME)
  await db.put(USER_STORE_NAME, uid, 'uid')
}

export const writeSessionToidb = async(session: IDBSession) => {
  const db = await openDB(DBNAME)
  await db.put(SWIPING_SESSIONS_STORE_NAME, session)
}

export const getUserFromidb = async() => {
  const db = await openDB(DBNAME)
  const uid: string = await db.get(USER_STORE_NAME, 'uid')
  return uid
}
