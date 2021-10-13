import { openDB } from "idb"
import { Session, SessionWithChosenCard, SessionWithReview, isSessionWithChosenCard, isSessionWithReview } from '@/types'
import { IDBSession, IDBSessionWithChosenCard, IDBSessionWithReview } from '@/types/indexeddbTypes'

export const DBNAME = 'decks'
export const USER_STORE_NAME = 'user'
export const SWIPING_SESSIONS_STORE_NAME = 'sessions'

export const writeUserToidb = async(uid: string) => {
  const db = await openDB(DBNAME)
  await db.put(USER_STORE_NAME, uid, 'uid')
}

export const writeSessionToidb = async(session: Session | SessionWithChosenCard | SessionWithReview) => {
  const idbSession: IDBSession = {
    ...session,
    datetime: session.datetime.toJSDate(),
    cardsSwiped: session.cardsSwiped.map(e => ({...e, card: {...e.card}})),
  }
  if (isSessionWithChosenCard(session)) {
    (idbSession as IDBSessionWithChosenCard).chosenCard = session.chosenCard
  }
  if (isSessionWithReview(session)) {
    (idbSession as IDBSessionWithReview).review = {
      ...session.review,
      datetime: session.review.datetime.toJSDate()
    }
  }
  const db = await openDB(DBNAME)
  await db.put(SWIPING_SESSIONS_STORE_NAME, idbSession)
}

export const getUserFromidb = async() => {
  const db = await openDB(DBNAME)
  const uid: string = await db.get(USER_STORE_NAME, 'uid')
  return uid
}
