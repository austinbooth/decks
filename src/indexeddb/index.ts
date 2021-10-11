import { openDB } from "idb"
import { Session } from '@/types'

export const DBNAME = 'decks'
export const USER_STORE_NAME = 'user'
export const SWIPING_SESSIONS_STORE_NAME = 'sessions'

export const writeUserToidb = async(uid: string) => {
  const db = await openDB(DBNAME)
  await db.put(USER_STORE_NAME, uid, 'uid')
}

export const writeSessionToidb = async(session: Session) => {
  const idbSession = {
    ...session,
    datetime: session.datetime.toJSDate(),
    cardsSwiped: session.cardsSwiped.map(e => ({...e, card: {...e.card}})),
    chosenCard: {...session.chosenCard}
  }
  const db = await openDB(DBNAME)
  await db.put(SWIPING_SESSIONS_STORE_NAME, idbSession)
}

export const getUserFromidb = async() => {
  const db = await openDB(DBNAME)
  const uid: string = await db.get(USER_STORE_NAME, 'uid')
  return uid
}
