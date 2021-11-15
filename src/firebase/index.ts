import firebase from './firebaseSingleton'
import { writeUserToidb, USER_STORE_NAME, SWIPING_SESSIONS_STORE_NAME, getUserFromidb } from '@/indexeddb'
import { Session, isSessionsWithChosenCardArray, SessionWithChosenCard, SessionWithReview, User, DeckInfo } from '@/types'
import * as T from 'io-ts'
import * as E from 'fp-ts/Either'
import { DateTime } from "luxon"
import { cloneDeep } from 'lodash'

const DeckInfoT = T.type({
  uid: T.string,
  name: T.string,
  description: T.string,
})
type DeckInfoT = T.TypeOf<typeof DeckInfoT>

const DeckInfoArrayT = T.array(DeckInfoT)
type DeckInfoArrayT = T.TypeOf<typeof DeckInfoArrayT>

const CardT = T.type({
  uid: T.string,
  headline: T.string,
  description: T.string,
})
type CardT = T.TypeOf<typeof CardT>

const CardArrayT = T.array(CardT)
type CardArrayT = T.TypeOf<typeof CardArrayT>

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

export const getAllPublisherDecks = async(): Promise<DeckInfoArrayT | undefined>  => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/decks/`).get()
    const decks = snapshot.docs.map((doc) => doc.data())
    const validated = validateDbResponse(DeckInfoT, decks)
    return validated
  } catch (err) {
    console.error(err)
  }
}

export const getAllCardsInDeck = async(deck = 'zRe6Gi7DUXNRDeNK10Ed'): Promise<CardArrayT | undefined> => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/decks/${deck}/cards/`).get()
    const cards = snapshot.docs.map((doc) => doc.data())

    const validated = validateDbResponse(CardT, cards)
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

export const setSessionInFireStore = async(session: Session | SessionWithChosenCard | SessionWithReview) => {
  try {
    console.log('Setting session...')
    const encodedSession = validateAndEncodeDbData(
      SessionWithReviewT.is(session) ? SessionWithReviewT
        : SessionWithChosenCardT.is(session) ? SessionWithChosenCardT
          : SessionBaseT,
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

export const getUnreviewedSessions = async(user: string): Promise<SessionWithChosenCardArrayT> => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`)
      .where('user', '==', user)
      .where('chosenCard', '!=', '').get()
    const sessions = snapshot.docs.map((doc) => doc.data()).filter(session => !('review' in session))
    const sessionsValidated = validateDbResponse(SessionWithChosenCardT, sessions)
    return sessionsValidated
  } catch (err) {
    console.error(err)
    return []
  }
}

const LuxonDateTimeT = new T.Type<DateTime, firebase.firestore.Timestamp, unknown>(
  'LuxonDateTimeT',
  (u: unknown): u is DateTime => u instanceof DateTime,
  (u: unknown, c: T.Context) => {
    if (!(u instanceof firebase.firestore.Timestamp)) {
      return T.failure(u, c)
    }
    return T.success(DateTime.fromJSDate(u.toDate()).setZone('Europe/London'))
  },
  (a: DateTime) => firebase.firestore.Timestamp.fromDate(a.toJSDate()),
)

const DeckRefT = T.type({
  uid: T.string,
  type: T.union([T.literal('publisher'), T.literal('user')])
})
type DeckRefT = T.TypeOf<typeof DeckInfoT>

const SwipedCardT = T.type({
  card: CardT,
  swiped: T.union([T.literal('left'), T.literal('right')])
})
type SwipedCardT = T.TypeOf<typeof SwipedCardT>

const SwipedCardArrayT = T.array(SwipedCardT)
type SwipedCardArrayT = T.TypeOf<typeof SwipedCardArrayT>

const SessionBaseT = T.type({
  uid: T.string,
  user: T.string,
  datetime: LuxonDateTimeT,
  deck: DeckRefT,
  cardsSwiped: SwipedCardArrayT,
})
type SessionBaseT = T.TypeOf<typeof SessionBaseT>

const SessionWithChosenCardT = T.intersection([SessionBaseT, T.type({
  chosenCard: T.string
})])
type SessionWithChosenCardT = T.TypeOf<typeof SessionWithChosenCardT>

const SessionWithChosenCardArrayT = T.array(SessionWithChosenCardT)
type SessionWithChosenCardArrayT = T.TypeOf<typeof SessionWithChosenCardArrayT>

const ReviewT = T.type({
  datetime: LuxonDateTimeT,
  reviewValue: T.union([T.literal(1), T.literal(2), T.literal(3), T.literal(4)])
})
type ReviewT = T.TypeOf<typeof ReviewT>

const SessionWithReviewT = T.intersection([SessionWithChosenCardT, T.type({review: ReviewT})])
type SessionWithReviewT = T.TypeOf<typeof SessionWithReviewT>

// TODO: This function is only being used by ReviewCard to fetch SessionWithChosenCard - narrow types?
export const getSessionForUser = async(sessionUid: string): Promise<SessionBaseT | SessionWithChosenCardT | SessionWithReviewT | string> => {
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
      SessionBaseT, SessionWithChosenCardT, SessionWithReviewT
    ]), sessionData)
    return SessionDataValidated.user === user ? SessionDataValidated : 'You are unauthorised to view this data.'
  } catch (err) {
    console.error(err)
    throw(err)
  }
}
