import { Session, SessionWithChosenCard, SessionWithReview, Review } from "../types"
import firebase from "@/firebase/firebaseSingleton"

export interface FireStoreSession extends Omit<Session, 'datetime'> {
  datetime: firebase.firestore.Timestamp
}

export interface FireStoreSessionWithChosenCard extends Omit<SessionWithChosenCard, 'datetime'> {
  datetime: firebase.firestore.Timestamp
}

interface FireStoreReview extends Omit<Review, 'datetime'> {
  datetime: firebase.firestore.Timestamp
}

export interface FireStoreSessionWithReview extends FireStoreSessionWithChosenCard {
  review: FireStoreReview
}

export const isFireStoreSessionWithChosenCard = (
  session: FireStoreSession | FireStoreSessionWithChosenCard | FireStoreSessionWithReview
): session is FireStoreSessionWithChosenCard => (session as FireStoreSessionWithChosenCard).chosenCard !== undefined

export const isFireStoreSessionWithReview = (
  session: FireStoreSession | FireStoreSessionWithChosenCard | FireStoreSessionWithReview
): session is FireStoreSessionWithReview => (session as FireStoreSessionWithReview).review !== undefined
