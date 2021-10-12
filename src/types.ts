import firebase from "@/firebase/firebaseSingleton"
import { DateTime } from "luxon"

export interface User {
  uid: string
  created: firebase.firestore.Timestamp
}

export interface Card {
  uid: string
  headline: string
  description: string
}

export interface SwipedCard {
  card: Card
  swiped: "left" | "right"
}

export interface Session {
  uid: string
  user: string
  datetime: DateTime
  cardsSwiped: SwipedCard[]
}

export interface SessionWithChosenCard extends Session {
  chosenCard: string
}

interface Review {
  datetime: DateTime
  review: string // TODO narrow to emojis
}

export interface SessionWithReview extends SessionWithChosenCard {
  review: Review
}

export interface IDBSession extends Omit<Session, 'datetime'> {
  datetime: Date
}

export interface IDBSessionWithChosenCard extends Omit<SessionWithChosenCard, 'datetime'> {
  datetime: Date
}

export const isSession = (
  session: firebase.firestore.DocumentData | Session
): session is Session => (session as Session).uid !== undefined

export const isSessionsWithChosenCardArray = (
  sessions: firebase.firestore.DocumentData[] | SessionWithChosenCard[]
): sessions is SessionWithChosenCard[] =>
  (sessions as SessionWithChosenCard[]).every((session) => session.chosenCard !== undefined)

export const isSessionWithChosenCard = (
  session: Session | SessionWithChosenCard
): session is SessionWithChosenCard => (session as SessionWithChosenCard).chosenCard !== undefined
