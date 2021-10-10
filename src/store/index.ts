import { createStore } from "vuex";
import { SWIPING_SESSIONS_STORE_NAME, writeSessionToidb, getUserFromidb } from '@/indexeddb'
import firebase from '@/firebase/firebaseSingleton'
import { setSessionInFireStore } from "@/firebase";
import { SwipedCard, Session, IDBSession } from '@/types'



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
  const idbSession: IDBSession = {
    ...session,
    datetime: session.datetime.toDate()
  }
  createdDoc.set(session)
  writeSessionToidb(idbSession)
  return session
}

export default createStore({
  state: {
    // counter: 0,
    CARD_CENTERED_X_COORD: '9%',
    CARD_CENTERED_Y_COORD: '5.25%',
    cards: [],
    currentSession: {
      cardsSwiped: [] as SwipedCard[],
    } as Session,
  },
  mutations: {
    // increment: (currentState, value) => currentState.counter += value
    setCards: (currentState, value) => currentState.cards = value,
    addSwipedCard: async(currentState, newCard) => {
      if (currentState.currentSession.cardsSwiped.length === 0) {
        const session = await setUpSwipingSession()
        currentState.currentSession = session
      }
      currentState.currentSession.cardsSwiped.push(newCard)
      const idbSession = {
        ...currentState.currentSession,
        datetime: currentState.currentSession.datetime.toDate(),
        cardsSwiped: currentState.currentSession.cardsSwiped.map(e => ({...e, card: {...e.card}}))
      }
      await writeSessionToidb(idbSession)
      await setSessionInFireStore(currentState.currentSession)
    },
  },
  actions: {},
  modules: {},
});
