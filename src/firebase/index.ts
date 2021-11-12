import firebase from './firebaseSingleton'
import { sessionConverter } from './converters'
import { writeUserToidb, USER_STORE_NAME, SWIPING_SESSIONS_STORE_NAME, getUserFromidb } from '@/indexeddb'
import { Session, isSessionsWithChosenCardArray, SessionWithChosenCard, SessionWithReview, User, DeckInfo } from '@/types'
import * as T from 'io-ts'
import * as E from 'fp-ts/Either'

const DeckInfoIOTS = T.type({
  uid: T.string,
  name: T.string,
  description: T.string,
})
type DeckInfoIOTS = T.TypeOf<typeof DeckInfoIOTS>

const DeckInfoArrayIOTS = T.array(DeckInfoIOTS)
type DeckInfoArrayIOTS = T.TypeOf<typeof DeckInfoArrayIOTS>

export const getAllPublisherDecks = async(): Promise<DeckInfoArrayIOTS | undefined>  => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/decks/`).get()
    const decks = snapshot.docs.map((doc) => doc.data())
    
    const decodedDecks = decks.map(deck => {
      const decoded = DeckInfoIOTS.decode(deck)
      if (E.isRight(decoded)) {
        return decoded.right
      }
      console.error('Invalid deck:', deck)
    })

    const filtered = decodedDecks.filter(DeckInfoIOTS.is)
    return filtered
  } catch (err) {
    console.error(err)
  }
}

export const getAllCardsInDeck = async(deck = 'zRe6Gi7DUXNRDeNK10Ed') => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/decks/${deck}/cards/`).get()
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

export const setSessionInFireStore = async(session: Session | SessionWithChosenCard | SessionWithReview) => {
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

export const getSessionForUser = async(sessionUid: string): Promise<Session | SessionWithChosenCard | SessionWithReview | string> => {
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