import firebase from './firebaseSingleton'
import { sessionConverter } from './converters'
import { writeUserToidb, USER_STORE_NAME, SWIPING_SESSIONS_STORE_NAME, getUserFromidb } from '@/indexeddb'
import { Session, isSessionsWithChosenCardArray, SessionWithChosenCard, User } from '@/types'

export const getAllCardsInDeck = async(deck = 'breakfast-deck') => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${deck}/`).get()
    const cards = snapshot.docs.map((doc) => doc.data())
    return cards
  } catch (err) {
    console.error(err)
  }
}

export const createAnonymousUser = async() => {
  try {
    const db = firebase.firestore()
    const firebaseNowTimestamp = firebase.firestore.Timestamp.now()
    const createdDoc = await db.collection(`/users/`).doc()
    if (createdDoc.id) {
      const initialUserData: User = {
        created: firebaseNowTimestamp,
        uid: createdDoc.id,
      }
      await Promise.all([
        createdDoc.set(initialUserData),
        writeUserToidb(createdDoc.id)
      ])
    }
    return createdDoc.id
  } catch (err) {
    console.error(err)
  }
}

export const setUserInFireStore = async(user: User) => {
  try {
    const db = firebase.firestore()
    await db.collection(`/users/`).doc(user.uid).set(user)
  } catch (err) {
    console.error(err)
  }
}

export const setSessionInFireStore = async(session: Session) => {
  try {
    console.log('Setting session...')
    const db = firebase.firestore()
    await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`)
      .withConverter(sessionConverter)
      .doc(session.uid).set(session)
  } catch (err) {
    console.error(err)
  }
}

export const getUnreviewedSessions = async(user: string): Promise<SessionWithChosenCard[]> => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`)
      .withConverter(sessionConverter)
      .where('user', '==', user)
      .where('chosenCard', '!=', '').get()
    const sessions = snapshot.docs.map((doc) => doc.data()).filter(session => !('review' in session))
    return isSessionsWithChosenCardArray(sessions) ? sessions : []
  } catch (err) {
    console.error(err)
    return []
  }
}

export const getSessionForUser = async(sessionUid: string): Promise<Session | SessionWithChosenCard | string> => {
  try {
    const user = await getUserFromidb()
    if (!user) {
      throw new Error('No user id')
    }
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`)
      .withConverter(sessionConverter)
      .where('uid', '==', sessionUid)
      .get()
    const [sessionData] = snapshot.docs.map(doc => doc.data())
    return sessionData.user === user ? sessionData : 'You are unauthorised to view this data.'
  } catch (err) {
    console.error(err)
    throw(err)
  }
}