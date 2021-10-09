import { createStore } from "vuex";
import { writeToidb, SWIPING_SESSIONS_STORE_NAME, writeSessionToidb, getUserFromidb } from '@/indexeddb'
import firebase from '@/firebase/firebaseSingleton'
import { setSessionInFireStore } from "@/firebase";
import { DateTime } from "luxon"
import { Card, SwipedCard } from '@/types'

export interface Session {
  uid: string
  datetime: firebase.firestore.Timestamp
  cardsSwiped: SwipedCard[]
  user: string
}

const setUpSwipingSession = async() => {
  const db = firebase.firestore()
  const firebaseNowTimestamp = firebase.firestore.Timestamp.now()
  const createdDoc = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`).doc()
  // get uid
  const uid = await getUserFromidb()
  const session: Session = {
    uid: createdDoc.id,
    datetime: firebaseNowTimestamp,
    cardsSwiped: [],
    user: uid,
  }
  createdDoc.set(session)
  writeSessionToidb(SWIPING_SESSIONS_STORE_NAME, {
    ...session,
    datetime: session.datetime.toDate()
  })
  return session
}

export default createStore({
  state: {
    // counter: 0,
    CARD_CENTERED_X_COORD: '9%',
    CARD_CENTERED_Y_COORD: '5.25%',
    cards: [],
    cardsSwiped: [] as SwipedCard[],
    currentSession: {
      
    } as Session,
  },
  mutations: {
    // increment: (currentState, value) => currentState.counter += value
    setCards: (currentState, value) => currentState.cards = value,
    addSwipedCard: async(currentState, newCard) => {
      if (currentState.cardsSwiped.length === 0) {
        const session = await setUpSwipingSession()
        currentState.currentSession = session
      }
      currentState.cardsSwiped.push(newCard) // TODO remove this as not required now saving to currentSession below
      currentState.currentSession.cardsSwiped.push(newCard)
      await writeSessionToidb(SWIPING_SESSIONS_STORE_NAME, {
        ...currentState.currentSession,
        datetime: currentState.currentSession.datetime.toDate(),
        cardsSwiped: currentState.currentSession.cardsSwiped.map(e => ({...e}))
      })
      await setSessionInFireStore(currentState.currentSession)
    },
  },
  actions: {},
  modules: {},
});
