import { openDB } from "idb"
import { IDBSession } from '@/types'

export const DBNAME = 'decks'
export const USER_STORE_NAME = 'user'
export const SWIPING_SESSIONS_STORE_NAME = 'sessions'

export const writeToidb = async(storeName: string, key: string, val: string) => {
  const db = await openDB(DBNAME)
  const tx = db.transaction(storeName, 'readwrite')
  const userStore = tx.objectStore(storeName)
  await userStore.put(val, key)
  await tx.done
}

export const writeSessionToidb = async(storeName: string, session: IDBSession) => {
  console.log('SESSION TO ADD:', session)
  const db = await openDB(DBNAME)
  await db.put(SWIPING_SESSIONS_STORE_NAME, session)
}

export const getUserFromidb = async() => {
  const db = await openDB(DBNAME)
  const uid: string = await db.get(USER_STORE_NAME, 'uid')
  return uid
}
