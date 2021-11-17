import { openDB } from "idb"
import * as E from 'fp-ts/Either'
import * as IOTS from '@/types/iotsTypes'
import { IDBSessionT, IDBSessionWithChosenCardT, IDBSessionWithReviewT } from '@/types/indexeddbTypes'
import { cloneDeep } from "lodash"

export const DBNAME = 'decks'
export const USER_STORE_NAME = 'user'
export const SWIPING_SESSIONS_STORE_NAME = 'sessions'

export const writeUserToidb = async(uid: string) => {
  const db = await openDB(DBNAME)
  await db.put(USER_STORE_NAME, uid, 'uid')
}

export const writeSessionToidb = async(session: IOTS.SessionT | IOTS.SessionWithChosenCardT | IOTS.SessionWithReviewT) => {
  const Model = IOTS.SessionWithReviewT.is(session) ? IDBSessionWithReviewT
  : IOTS.SessionWithChosenCardT.is(session) ? IDBSessionWithChosenCardT
    : IDBSessionT

  const decoded = Model.decode(cloneDeep(session))
  if (E.isRight(decoded)) {
    const idbSession = decoded.right
    console.log('Session to be saved to IDB:', idbSession)
    const db = await openDB(DBNAME)
    await db.put(SWIPING_SESSIONS_STORE_NAME, idbSession)
  } else {
    console.error('Invalid session when writing to IDB:', session)
  } 
}

export const getUserFromidb = async() => {
  const db = await openDB(DBNAME)
  const uid: string = await db.get(USER_STORE_NAME, 'uid')
  return uid
}
