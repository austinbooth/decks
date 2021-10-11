import firebase from "@/firebase/firebaseSingleton"
import { DateTime } from "luxon"

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

export interface Session {
  uid: string
  user: string
  datetime: DateTime
  cardsSwiped: SwipedCard[]
  chosenCard: ChosenCard
}

// export interface Session extends SessionBase {
//   datetime: firebase.firestore.Timestamp
// }

// export interface IDBSession extends SessionBase {
//   datetime: Date
// }

// TODO:
// Harmonise these types that differ only in datetime type
//  - make SessionBase -> Session and add 'datetime: DateTime' prop
//  - add converter for saving/loading sessions from firebase (DateTime -> Firebase Timestamp)
//  - change the writeSessionToidb fn to change DateTime -> Date type
// create types for Session, SessionWithChosenCard, SessionWithReviewedChosenCard

export const isSession = (
  session: firebase.firestore.DocumentData | Session
): session is Session => (session as Session).uid !== undefined

export const isSessionsArray = (
  sessions: firebase.firestore.DocumentData[] | Session[]
): sessions is Session[] =>
  (sessions as Session[]).every((session) => session.uid !== undefined)
