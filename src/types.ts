import firebase from '@/firebase/firebaseSingleton'

export interface Card {
  uid: string
  headline: string
  description: string
}

export interface SwipedCard {
  card: Card
  swiped: 'left' | 'right'
}

interface SessionBase {
  uid: string
  cardsSwiped: SwipedCard[]
  user: string
  chosenCard: null | string
}

export interface Session extends SessionBase {
  datetime: firebase.firestore.Timestamp
}

export interface IDBSession extends SessionBase {
  datetime: Date
}
