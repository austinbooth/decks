import { createStore } from "vuex";
import { SWIPING_SESSIONS_STORE_NAME, writeSessionToidb, getUserFromidb } from '@/indexeddb'
import firebase from '@/firebase/firebaseSingleton'
import { setSessionInFireStore } from "@/firebase"
import { DateTime } from "luxon";
import { SwipedCard, Session, SessionWithChosenCard } from '@/types'

const setUpSwipingSession = async() => {
  const db = firebase.firestore()
  // const firebaseNowTimestamp = firebase.firestore.Timestamp.now()
  const createdDoc = await db.collection(`/${SWIPING_SESSIONS_STORE_NAME}/`).doc()
  // get uid
  const uid = await getUserFromidb()
  const session: Session = {
    uid: createdDoc.id,
    datetime: DateTime.now(),
    deck: {
      uid: 'zRe6Gi7DUXNRDeNK10Ed', // hardcode for now
      type: 'publisher'
    },
    cardsSwiped: [],
    user: uid,
  }
  const firebaseSession = {
    ...session,
    datetime: firebase.firestore.Timestamp.fromDate(session.datetime.toJSDate())
  }
  createdDoc.set(firebaseSession) // use firebase fn for this
  writeSessionToidb(session)
  return session
}

const writeSessionToFirebaseAndIDB = async(session: Session) => {
  await writeSessionToidb(session)
  await setSessionInFireStore(session)
}

export default createStore({
  state: {
    // counter: 0,
    CARD_CENTERED_X_COORD: '9%',
    CARD_CENTERED_Y_COORD: '5.25%',
    cards: [],
    currentSession: {
      cardsSwiped: [] as SwipedCard[],
    } as Session | SessionWithChosenCard,
    chosenDeck: '',
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
      await writeSessionToFirebaseAndIDB(currentState.currentSession)
    },
    addChosenCard: async(currentState, chosenCardId: string) => {
      if (chosenCardId) {
        (currentState.currentSession as SessionWithChosenCard).chosenCard = chosenCardId
        await writeSessionToFirebaseAndIDB(currentState.currentSession)
      } else {
        throw new Error('No chosen card ID')
      }
    },
    setChosenDeck: (currentState, deck) => currentState.chosenDeck = deck
  },
  actions: {},
  modules: {},
});
