import firebase from "@/firebase/firebaseSingleton"

export interface Card {
  uid: string
  headline: string
  description: string
}

export interface SwipedCard {
  card: Card
  swiped: "left" | "right"
}

interface ChosenCard {
  uid: string
  reviewed: boolean
}

interface SessionBase {
  uid: string
  cardsSwiped: SwipedCard[]
  user: string
  chosenCard: ChosenCard
}

export interface Session extends SessionBase {
  datetime: firebase.firestore.Timestamp
}

export interface IDBSession extends SessionBase {
  datetime: Date
}

export const isSession = (
  session: firebase.firestore.DocumentData | Session
): session is Session => (session as Session).uid !== undefined

export const isSessionsArray = (
  sessions: firebase.firestore.DocumentData[] | Session[]
): sessions is Session[] =>
  (sessions as Session[]).every((session) => session.uid !== undefined)
