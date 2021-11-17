import firebase from './firebaseSingleton'
import { writeUserToidb, USER_STORE_NAME, SWIPING_SESSIONS_STORE_NAME, getUserFromidb } from '@/indexeddb'
import { User } from '@/types'
import * as T from 'io-ts'
import * as E from 'fp-ts/Either'
import * as IOTS from '@/types/iotsTypes'

const validateDbResponse = <M extends T.TypeC<any> | T.UnionC<any> |  T.IntersectionC<any>, D extends firebase.firestore.DocumentData[]>(Model: M, data: D) => {
  const ArrayT = T.array(Model)
  type ArrayT = T.TypeOf<typeof ArrayT>
  const decodedDecks = data.map(item => {
    const decoded = Model.decode(item)
    if (E.isRight(decoded)) {
      return decoded.right
    }
    console.error('Invalid item:', item)
  })
  const filtered = decodedDecks.filter(Model.is) as ArrayT
  return filtered
}

const validateAndEncodeDbData = <M extends T.TypeC<any> |  T.UnionC<any> | T.IntersectionC<any>, D>(Model: M, data: D) => {
  try {
    const encoded = Model.encode(data)
    console.log('Encoded:', encoded)
    return encoded
  } catch (err) {
    console.error('Encoding - invalid data:', data)
  }
}

export const getAllPublisherDecks = async(): Promise<IOTS.DeckInfoArrayT | undefined>  => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/decks/`).get()
    const decks = snapshot.docs.map((doc) => doc.data())
    const validated = validateDbResponse(IOTS.DeckInfoT, decks)
    return validated
  } catch (err) {
    console.error(err)
  }
}

export const getAllCardsInDeck = async(deck = 'zRe6Gi7DUXNRDeNK10Ed'): Promise<IOTS.CardArrayT | undefined> => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/decks/${deck}/cards/`).get()
    const cards = snapshot.docs.map((doc) => doc.data())

    const validated = validateDbResponse(IOTS.CardT, cards)
    return validated
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

export const setSessionInFireStore = async(session: IOTS.SessionT | IOTS.SessionWithChosenCardT | IOTS.SessionWithReviewT) => {
  try {
    console.log('Setting session...')
    const encodedSession = validateAndEncodeDbData(
      IOTS.SessionWithReviewT.is(session) ? IOTS.SessionWithReviewT
        : IOTS.SessionWithChosenCardT.is(session) ? IOTS.SessionWithChosenCardT
          : IOTS.SessionT,
      session
    )
    if (encodedSession) {
      const db = firebase.firestore()
      await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`).doc(encodedSession.uid).set(encodedSession)
    }
  } catch (err) {
    console.error(err)
  }
}

export const getUnreviewedSessions = async(user: string): Promise<IOTS.SessionWithChosenCardArrayT> => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`)
      .where('user', '==', user)
      .where('chosenCard', '!=', '').get()
    const sessions = snapshot.docs.map((doc) => doc.data()).filter(session => !('review' in session))
    const sessionsValidated = validateDbResponse(IOTS.SessionWithChosenCardT, sessions)
    return sessionsValidated
  } catch (err) {
    console.error(err)
    return []
  }
}

// TODO: This function is only being used by ReviewCard to fetch SessionWithChosenCard - narrow types?
export const getSessionForUser = async(sessionUid: string): Promise<IOTS.SessionT | IOTS.SessionWithChosenCardT | IOTS.SessionWithReviewT | string> => {
  try {
    const user = await getUserFromidb()
    if (!user) {
      throw new Error('No user id')
    }
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`)
      .where('uid', '==', sessionUid)
      .get()
    const sessionData = snapshot.docs.map(doc => doc.data())
    const [SessionDataValidated] = validateDbResponse(T.union([
      IOTS.SessionT, IOTS.SessionWithChosenCardT, IOTS.SessionWithReviewT
    ]), sessionData)
    return SessionDataValidated.user === user ? SessionDataValidated : 'You are unauthorised to view this data.'
  } catch (err) {
    console.error(err)
    throw(err)
  }
}
